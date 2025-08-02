from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config.database import get_db
from services.team_simulation_service import TeamSimulationService
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter()

class CreateEnvironmentRequest(BaseModel):
    platform: str = 'slack'  # 'slack' or 'teams'

class GenerateAttackRequest(BaseModel):
    attack_type: str = None  # 'credential_harvest', 'malware_link', 'urgent_request'

class MessageActionRequest(BaseModel):
    action: str  # 'click', 'report', 'respond'
    response_text: str = None

@router.post("/environment")
def create_environment(
    request: CreateEnvironmentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = TeamSimulationService(db)
    environment = service.create_team_environment(str(current_user.id), request.platform)
    
    return {
        "id": str(environment.id),
        "platform": environment.platform,
        "team_name": environment.team_name,
        "colleagues": environment.colleagues,
        "channels": environment.channels
    }

@router.get("/environment")
def get_environment(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = TeamSimulationService(db)
    environment = service.get_user_environment(str(current_user.id))
    
    if not environment:
        raise HTTPException(status_code=404, detail="No environment found")
    
    return {
        "id": str(environment.id),
        "platform": environment.platform,
        "team_name": environment.team_name,
        "colleagues": environment.colleagues,
        "channels": environment.channels
    }

@router.post("/attack/{environment_id}")
def generate_attack(
    environment_id: str,
    request: GenerateAttackRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = TeamSimulationService(db)
    message = service.generate_social_attack(environment_id, request.attack_type)
    
    if not message:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    return {
        "id": str(message.id),
        "sender_name": message.sender_name,
        "sender_role": message.sender_role,
        "channel": message.channel,
        "message_content": message.message_content,
        "attack_type": message.attack_type,
        "created_at": message.created_at
    }

@router.post("/message/{message_id}/action")
def handle_message_action(
    message_id: str,
    request: MessageActionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = TeamSimulationService(db)
    message = service.handle_message_action(message_id, request.action, request.response_text)
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return {
        "message": "Action recorded",
        "action": request.action,
        "is_clicked": message.is_clicked,
        "is_reported": message.is_reported
    }

@router.get("/messages/{environment_id}")
def get_messages(
    environment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = TeamSimulationService(db)
    messages = service.get_environment_messages(environment_id)
    
    return [{
        "id": str(msg.id),
        "sender_name": msg.sender_name,
        "sender_role": msg.sender_role,
        "channel": msg.channel,
        "message_content": msg.message_content,
        "attack_type": msg.attack_type,
        "is_clicked": msg.is_clicked,
        "is_reported": msg.is_reported,
        "user_response": msg.user_response,
        "created_at": msg.created_at
    } for msg in messages]