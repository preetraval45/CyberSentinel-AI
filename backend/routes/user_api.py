from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime
from config.database import get_db
from models.user import User
from middleware.rbac import user_required

router = APIRouter()

class SimulationResponse(BaseModel):
    id: str
    name: str
    type: str
    status: str
    completion_rate: float
    assigned_date: datetime
    due_date: datetime
    last_attempt: datetime = None

class PersonalStats(BaseModel):
    risk_score: int
    completion_rate: float
    total_simulations: int
    completed_simulations: int
    average_score: float

class SessionReport(BaseModel):
    id: str
    simulation_name: str
    score: int
    completion_date: datetime
    time_taken: int
    attempts: int

@router.get("/dashboard", response_model=PersonalStats)
def get_user_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(user_required)
):
    # Mock data - replace with actual database queries
    return PersonalStats(
        risk_score=75,
        completion_rate=68.5,
        total_simulations=12,
        completed_simulations=8,
        average_score=82.3
    )

@router.get("/simulations", response_model=List[SimulationResponse])
def get_assigned_simulations(
    db: Session = Depends(get_db),
    current_user: User = Depends(user_required)
):
    # Mock data - replace with actual user-specific queries
    return [
        SimulationResponse(
            id="1",
            name="Phishing Email Detection",
            type="Email Security",
            status="completed",
            completion_rate=95.0,
            assigned_date=datetime(2024, 1, 15),
            due_date=datetime(2024, 2, 15),
            last_attempt=datetime(2024, 1, 20)
        ),
        SimulationResponse(
            id="2", 
            name="Password Security Training",
            type="Authentication",
            status="in_progress",
            completion_rate=60.0,
            assigned_date=datetime(2024, 1, 20),
            due_date=datetime(2024, 2, 20)
        ),
        SimulationResponse(
            id="3",
            name="Social Engineering Awareness",
            type="Human Factors",
            status="pending",
            completion_rate=0.0,
            assigned_date=datetime(2024, 1, 25),
            due_date=datetime(2024, 2, 25)
        )
    ]

@router.get("/reports", response_model=List[SessionReport])
def get_user_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(user_required)
):
    # Mock data - replace with user-specific session data
    return [
        SessionReport(
            id="1",
            simulation_name="Phishing Email Detection",
            score=95,
            completion_date=datetime(2024, 1, 20),
            time_taken=1200,
            attempts=2
        ),
        SessionReport(
            id="2",
            simulation_name="Password Security Training", 
            score=78,
            completion_date=datetime(2024, 1, 22),
            time_taken=900,
            attempts=1
        )
    ]

@router.post("/simulations/{simulation_id}/start")
def start_simulation(
    simulation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(user_required)
):
    # Verify user has access to this simulation
    return {"message": "Simulation started", "session_id": f"session_{simulation_id}_{current_user.id}"}

@router.post("/simulations/{simulation_id}/replay")
def replay_simulation(
    simulation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(user_required)
):
    # Allow replay of completed simulations
    return {"message": "Simulation replay started", "session_id": f"replay_{simulation_id}_{current_user.id}"}