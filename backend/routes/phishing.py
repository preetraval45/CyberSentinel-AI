from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config.database import get_db
from services.phishing_service import PhishingService
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter()

class GenerateEmailRequest(BaseModel):
    difficulty: str = "beginner"

class TrackClickRequest(BaseModel):
    email_id: str

@router.post("/generate")
def generate_phishing_email(
    request: GenerateEmailRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = PhishingService(db)
    email = service.generate_phishing_email(str(current_user.id), request.difficulty)
    return {
        "id": str(email.id),
        "subject": email.subject,
        "sender": email.sender,
        "content": email.content,
        "type": email.phishing_type,
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
        "is_clicked": email.is_clicked,
        "is_reported": email.is_reported,
        "created_at": email.created_at
    } for email in emails]

@router.post("/click")
def track_click(
    request: TrackClickRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = PhishingService(db)
    email = service.track_click(request.email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    return {"message": "Click tracked", "clicked_at": email.clicked_at}

@router.post("/report")
def report_phishing(
    request: TrackClickRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = PhishingService(db)
    email = service.report_phishing(request.email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    return {"message": "Phishing reported", "reported_at": email.reported_at}