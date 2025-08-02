from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config.database import get_db
from services.ransomware_service import RansomwareService
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter()

class CreateSimulationRequest(BaseModel):
    scenario_type: str  # 'crypto_locker', 'file_encrypt'
    difficulty_level: int = 1

class ExecuteActionRequest(BaseModel):
    action: str
    time_taken: float = 0.0

@router.post("/create")
def create_simulation(
    request: CreateSimulationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = RansomwareService(db)
    simulation = service.create_simulation(
        str(current_user.id),
        request.scenario_type,
        request.difficulty_level
    )
    
    state = service.get_simulation_state(str(simulation.id))
    return state

@router.post("/action/{simulation_id}")
def execute_action(
    simulation_id: str,
    request: ExecuteActionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = RansomwareService(db)
    result = service.execute_action(simulation_id, request.action, request.time_taken)
    
    if not result:
        raise HTTPException(status_code=404, detail="Simulation not found")
    
    return result

@router.get("/state/{simulation_id}")
def get_simulation_state(
    simulation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = RansomwareService(db)
    state = service.get_simulation_state(simulation_id)
    
    if not state:
        raise HTTPException(status_code=404, detail="Simulation not found")
    
    return state

@router.get("/history")
def get_simulation_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = RansomwareService(db)
    simulations = service.get_user_simulations(str(current_user.id))
    
    return [{
        "id": str(sim.id),
        "scenario_type": sim.scenario_type,
        "difficulty_level": sim.difficulty_level,
        "is_completed": sim.is_completed,
        "final_score": sim.final_score,
        "time_taken": sim.time_taken,
        "created_at": sim.created_at
    } for sim in simulations]