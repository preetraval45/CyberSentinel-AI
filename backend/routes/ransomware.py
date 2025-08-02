from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config.database import get_db
from services.ransomware_service import RansomwareService
from services.ai_simulation_service import AISimulationService
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
    # Generate AI-powered scenario
    ai_service = AISimulationService()
    scenario_data = ai_service.generate_ransomware_scenario(request.difficulty_level)
    
    service = RansomwareService(db)
    simulation = service.create_simulation_from_ai(
        str(current_user.id),
        request.scenario_type,
        request.difficulty_level,
        scenario_data
    )
    
    return {
        "id": str(simulation.id),
        "scenario": scenario_data["scenario"],
        "response_steps": scenario_data["response_steps"],
        "scoring_criteria": scenario_data["scoring_criteria"],
        "current_step": 0,
        "total_steps": len(scenario_data["response_steps"])
    }

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