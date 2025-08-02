from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from config.database import get_db
from services.phishing_service import PhishingService
from services.personalized_phishing_service import PersonalizedPhishingService
from middleware.auth_middleware import get_current_user
from models.user import User
import time

router = APIRouter()

class GenerateEmailRequest(BaseModel):
    difficulty_level: int = 1

class TrackActionRequest(BaseModel):
    email_id: str
    response_time: Optional[float] = None

class DifficultyUpdateRequest(BaseModel):
    difficulty_level: int

@router.post("/generate")
def generate_phishing_email(
    request: GenerateEmailRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    personalized_service = PersonalizedPhishingService(db)
    email, metadata = personalized_service.generate_personalized_email(
        str(current_user.id), 
        request.difficulty_level
    )
    
    return {
        "id": str(email.id),
        "subject": email.subject,
        "sender": email.sender,
        "content": email.content,
        "type": email.phishing_type,
        "difficulty_level": email.difficulty_level,
        "ai_click_likelihood": round(email.ai_click_likelihood * 100, 1),
        "personalization": {
            "psychological_triggers": metadata.get("psychological_triggers", []),
            "industry_context": metadata.get("industry_context", ""),
            "personalization_elements": metadata.get("personalization_elements", [])
        },
        "created_at": email.created_at
    }

@router.get("/inbox")
def get_inbox(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = PhishingService(db)
    emails = service.get_user_emails(str(current_user.id))
    return [{
        "id": str(email.id),
        "subject": email.subject,
        "sender": email.sender,
        "content": email.content,
        "difficulty_level": email.difficulty_level,
        "ai_click_likelihood": round(email.ai_click_likelihood * 100, 1),
        "is_clicked": email.is_clicked,
        "is_reported": email.is_reported,
        "created_at": email.created_at
    } for email in emails]

@router.post("/click")
def track_click(
    request: TrackActionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = PhishingService(db)
    result = service.track_click(request.email_id, str(current_user.id), request.response_time)
    if not result:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Update game session
    service.update_game_session(str(current_user.id), "click", result["feedback"]["xp"])
    
    return {
        "message": "Click tracked",
        "clicked_at": result["email"].clicked_at,
        "feedback": result["feedback"],
        "alert_id": str(result["alert"].id)
    }

@router.post("/report")
def report_phishing(
    request: TrackActionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = PhishingService(db)
    result = service.report_phishing(request.email_id, str(current_user.id), request.response_time)
    if not result:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Update game session
    service.update_game_session(str(current_user.id), "report", result["feedback"]["xp"])
    
    return {
        "message": "Phishing reported",
        "reported_at": result["email"].reported_at,
        "feedback": result["feedback"],
        "alert_id": str(result["alert"].id)
    }

@router.get("/game-session")
def get_game_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = PhishingService(db)
    session = service.get_or_create_game_session(str(current_user.id))
    return {
        "id": str(session.id),
        "difficulty_level": session.difficulty_level,
        "score": session.score,
        "emails_processed": session.emails_processed,
        "correct_identifications": session.correct_identifications,
        "false_positives": session.false_positives,
        "clicks_on_malicious": session.clicks_on_malicious,
        "accuracy": round((session.correct_identifications / max(session.emails_processed, 1)) * 100, 1),
        "created_at": session.created_at
    }

@router.post("/update-difficulty")
def update_difficulty(
    request: DifficultyUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = PhishingService(db)
    session = service.get_or_create_game_session(str(current_user.id))
    session.difficulty_level = max(1, min(3, request.difficulty_level))
    db.commit()
    return {"message": "Difficulty updated", "new_level": session.difficulty_level}

@router.get("/alerts")
def get_recent_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from models.phishing import PhishingAlert
    alerts = db.query(PhishingAlert).filter(
        PhishingAlert.user_id == str(current_user.id)
    ).order_by(PhishingAlert.created_at.desc()).limit(10).all()
    
    return [{
        "id": str(alert.id),
        "alert_type": alert.alert_type,
        "feedback_message": alert.feedback_message,
        "xp_awarded": alert.xp_awarded,
        "response_time": alert.response_time,
        "created_at": alert.created_at
    } for alert in alerts]