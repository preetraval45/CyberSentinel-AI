from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config.database import get_db
from services.voice_service import VoiceService
from middleware.auth_middleware import get_current_user
from models.user import User
import tempfile
import os

router = APIRouter()

class CreateCallRequest(BaseModel):
    scenario_type: str  # 'tech_support', 'bank_fraud', 'prize_scam'
    difficulty_level: int = 1

@router.post("/create")
async def create_voice_call(
    request: CreateCallRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = VoiceService(db)
    call = await service.create_voice_call(
        str(current_user.id), 
        request.scenario_type, 
        request.difficulty_level
    )
    
    # Read audio file and return as base64 or URL
    with open(call.audio_prompt_url, "rb") as audio_file:
        audio_data = audio_file.read()
    
    return {
        "call_id": str(call.id),
        "scenario_type": call.scenario_type,
        "difficulty_level": call.difficulty_level,
        "transcript": call.transcript,
        "audio_data": audio_data.hex(),  # Convert to hex for JSON transport
        "created_at": call.created_at
    }

@router.post("/respond/{call_id}")
async def submit_voice_response(
    call_id: str,
    audio_file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = VoiceService(db)
    
    # Save uploaded audio to temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
        content = await audio_file.read()
        temp_file.write(content)
        temp_path = temp_file.name
    
    try:
        call = await service.transcribe_user_response(call_id, temp_path)
        if not call:
            raise HTTPException(status_code=404, detail="Call not found")
        
        feedback = service.get_call_feedback(call_id)
        
        return {
            "call_id": str(call.id),
            "transcript": call.user_response_transcript,
            "ai_score": call.ai_score,
            "vulnerability_score": call.vulnerability_score,
            "feedback": [{
                "type": f.feedback_type,
                "message": f.message,
                "score_impact": f.score_impact
            } for f in feedback],
            "completed_at": call.completed_at
        }
    finally:
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.unlink(temp_path)

@router.get("/history")
def get_call_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = VoiceService(db)
    calls = service.get_user_calls(str(current_user.id))
    
    return [{
        "id": str(call.id),
        "scenario_type": call.scenario_type,
        "difficulty_level": call.difficulty_level,
        "ai_score": call.ai_score,
        "vulnerability_score": call.vulnerability_score,
        "is_completed": call.is_completed,
        "created_at": call.created_at,
        "completed_at": call.completed_at
    } for call in calls]

@router.get("/feedback/{call_id}")
def get_call_feedback(
    call_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = VoiceService(db)
    feedback = service.get_call_feedback(call_id)
    
    return [{
        "id": str(f.id),
        "feedback_type": f.feedback_type,
        "message": f.message,
        "score_impact": f.score_impact,
        "created_at": f.created_at
    } for f in feedback]