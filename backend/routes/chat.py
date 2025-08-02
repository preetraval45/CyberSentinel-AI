from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config.database import get_db
from services.chat_service import ChatService
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter()

class CreateSessionRequest(BaseModel):
    scenario_type: str
    ai_persona: str

class SendMessageRequest(BaseModel):
    session_id: str
    message: str

@router.post("/session")
def create_chat_session(
    request: CreateSessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ChatService(db)
    session = service.create_session(
        str(current_user.id),
        request.scenario_type,
        request.ai_persona
    )
    return {
        "session_id": str(session.id),
        "scenario_type": session.scenario_type,
        "ai_persona": session.ai_persona,
        "created_at": session.created_at
    }

@router.post("/message")
def send_message(
    request: SendMessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ChatService(db)
    ai_response = service.generate_ai_response(request.session_id, request.message)
    if not ai_response:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "user_message": request.message,
        "ai_response": ai_response.message,
        "timestamp": ai_response.created_at
    }

@router.get("/session/{session_id}/messages")
def get_messages(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ChatService(db)
    messages = service.get_session_messages(session_id)
    return [{
        "id": str(msg.id),
        "sender_type": msg.sender_type,
        "message": msg.message,
        "created_at": msg.created_at
    } for msg in messages]

@router.post("/session/{session_id}/end")
def end_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ChatService(db)
    session = service.end_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"message": "Session ended", "ended_at": session.ended_at}