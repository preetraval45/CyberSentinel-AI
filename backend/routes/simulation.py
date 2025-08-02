from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config.database import get_db
from services.url_service import URLService
from services.password_service import PasswordService
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter()

class GenerateURLRequest(BaseModel):
    url_type: str
    target_url: str = None

class TrackClickRequest(BaseModel):
    url_id: str
    user_input: dict = None

class PasswordCheckRequest(BaseModel):
    password: str

@router.post("/url/generate")
def generate_malicious_url(
    request: GenerateURLRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = URLService(db)
    url_record = service.generate_malicious_url(
        str(current_user.id),
        request.url_type,
        request.target_url
    )
    return {
        "id": str(url_record.id),
        "original_url": url_record.original_url,
        "shortened_url": url_record.shortened_url,
        "qr_code": url_record.qr_code_path,
        "url_type": url_record.url_type,
        "created_at": url_record.created_at
    }

@router.get("/url/list")
def get_user_urls(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = URLService(db)
    urls = service.get_user_urls(str(current_user.id))
    return [{
        "id": str(url.id),
        "original_url": url.original_url,
        "shortened_url": url.shortened_url,
        "qr_code": url.qr_code_path,
        "url_type": url.url_type,
        "is_clicked": url.is_clicked,
        "click_count": url.click_count,
        "created_at": url.created_at
    } for url in urls]

@router.post("/url/click")
def track_url_click(
    request: TrackClickRequest,
    http_request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = URLService(db)
    client_ip = http_request.client.host
    user_agent = http_request.headers.get("user-agent", "")
    
    url_record = service.track_click(
        request.url_id,
        client_ip,
        user_agent,
        request.user_input
    )
    
    if not url_record:
        raise HTTPException(status_code=404, detail="URL not found")
    
    return {
        "message": "Click tracked",
        "clicked_at": url_record.clicked_at,
        "click_count": url_record.click_count,
        "warning": "⚠️ This was a simulated malicious URL! In real life, this could have compromised your security."
    }

@router.post("/password/check")
async def check_password(
    request: PasswordCheckRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = PasswordService(db)
    result = await service.check_password_hibp(str(current_user.id), request.password)
    
    return {
        "is_pwned": result.is_pwned,
        "breach_count": result.breach_count,
        "strength_score": result.strength_score,
        "feedback": result.feedback,
        "checked_at": result.checked_at
    }