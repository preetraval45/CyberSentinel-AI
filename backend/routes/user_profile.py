from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config.database import get_db
from models.user_profile import UserProfile
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter()

class UpdateProfileRequest(BaseModel):
    job_role: str = None
    department: str = None
    company_size: str = None
    industry: str = None
    location: str = None
    language_preference: str = None
    communication_style: str = None

@router.get("/profile")
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == str(current_user.id)).first()
    
    if not profile:
        # Create default profile
        profile = UserProfile(user_id=str(current_user.id))
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    return {
        "job_role": profile.job_role,
        "department": profile.department,
        "company_size": profile.company_size,
        "industry": profile.industry,
        "location": profile.location,
        "language_preference": profile.language_preference,
        "communication_style": profile.communication_style,
        "vulnerability_patterns": profile.vulnerability_patterns or [],
        "response_history": profile.response_history or []
    }

@router.put("/profile")
def update_profile(
    request: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == str(current_user.id)).first()
    
    if not profile:
        profile = UserProfile(user_id=str(current_user.id))
        db.add(profile)
    
    # Update fields if provided
    if request.job_role is not None:
        profile.job_role = request.job_role
    if request.department is not None:
        profile.department = request.department
    if request.company_size is not None:
        profile.company_size = request.company_size
    if request.industry is not None:
        profile.industry = request.industry
    if request.location is not None:
        profile.location = request.location
    if request.language_preference is not None:
        profile.language_preference = request.language_preference
    if request.communication_style is not None:
        profile.communication_style = request.communication_style
    
    db.commit()
    
    return {"message": "Profile updated successfully"}