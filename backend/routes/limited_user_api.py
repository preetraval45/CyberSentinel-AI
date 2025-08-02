from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime
from config.database import get_db
from models.user import User
from middleware.rbac import limited_user_required

router = APIRouter()

class LimitedProfile(BaseModel):
    email: str
    role: str
    created_at: datetime
    risk_score: int

class CompletedSimulation(BaseModel):
    id: str
    name: str
    completion_date: datetime
    score: int

@router.get("/profile", response_model=LimitedProfile)
def get_limited_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(limited_user_required)
):
    return LimitedProfile(
        email=current_user.email,
        role=current_user.role.value,
        created_at=current_user.created_at,
        risk_score=65  # Mock risk score
    )

@router.get("/completed-simulations", response_model=List[CompletedSimulation])
def get_completed_simulations(
    db: Session = Depends(get_db),
    current_user: User = Depends(limited_user_required)
):
    # Mock data - replace with actual user-specific completed simulations
    return [
        CompletedSimulation(
            id="1",
            name="Basic Security Awareness",
            completion_date=datetime(2024, 1, 15),
            score=78
        ),
        CompletedSimulation(
            id="2",
            name="Password Basics",
            completion_date=datetime(2024, 1, 10),
            score=85
        )
    ]