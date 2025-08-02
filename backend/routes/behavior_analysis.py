from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.database import get_db
from services.behavior_analysis_service import BehaviorAnalysisService
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter()

@router.get("/profile")
def get_behavior_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = BehaviorAnalysisService(db)
    profile = service.get_or_create_profile(str(current_user.id))
    
    return {
        "urgency_susceptibility": profile.urgency_susceptibility,
        "authority_susceptibility": profile.authority_susceptibility,
        "curiosity_susceptibility": profile.curiosity_susceptibility,
        "fear_susceptibility": profile.fear_susceptibility,
        "trust_susceptibility": profile.trust_susceptibility,
        "click_rate": profile.click_rate,
        "report_rate": profile.report_rate,
        "avg_response_time": profile.avg_response_time,
        "improvement_rate": profile.improvement_rate
    }

@router.get("/insights")
def get_behavior_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = BehaviorAnalysisService(db)
    return service.generate_behavior_insights(str(current_user.id))

@router.get("/training-plan")
def get_training_plan(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = BehaviorAnalysisService(db)
    return service.get_adaptive_training_plan(str(current_user.id))