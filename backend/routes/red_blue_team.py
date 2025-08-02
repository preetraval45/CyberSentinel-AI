from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config.database import get_db
from services.red_blue_service import RedBlueService
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter()

class CreateCompetitionRequest(BaseModel):
    name: str
    rounds: int = 3
    duration: int = 300

class JoinTeamRequest(BaseModel):
    team: str  # 'red' or 'blue'

class SubmitActionRequest(BaseModel):
    action_type: str
    target: str = ""
    description: str

@router.post("/competition")
def create_competition(
    request: CreateCompetitionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = RedBlueService(db)
    competition = service.create_competition(request.name, request.rounds, request.duration)
    
    return {
        "id": str(competition.id),
        "name": competition.name,
        "status": competition.status,
        "total_rounds": competition.total_rounds,
        "round_duration": competition.round_duration
    }

@router.post("/competition/{competition_id}/join")
def join_team(
    competition_id: str,
    request: JoinTeamRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = RedBlueService(db)
    member = service.join_team(competition_id, str(current_user.id), request.team)
    
    return {
        "team": member.team,
        "role": member.role,
        "joined_at": member.joined_at
    }

@router.post("/competition/{competition_id}/start")
def start_competition(
    competition_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = RedBlueService(db)
    competition = service.start_competition(competition_id)
    
    if not competition:
        raise HTTPException(status_code=404, detail="Competition not found")
    
    return {"status": competition.status, "round_end_time": competition.round_end_time}

@router.post("/competition/{competition_id}/action")
def submit_action(
    competition_id: str,
    request: SubmitActionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = RedBlueService(db)
    action = service.submit_action(
        competition_id,
        str(current_user.id),
        request.action_type,
        request.target,
        request.description
    )
    
    if not action:
        raise HTTPException(status_code=400, detail="Failed to submit action")
    
    return {
        "action_type": action.action_type,
        "points_awarded": action.points_awarded,
        "is_successful": action.is_successful,
        "timestamp": action.timestamp
    }

@router.get("/competition/{competition_id}/state")
def get_competition_state(
    competition_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = RedBlueService(db)
    state = service.get_competition_state(competition_id)
    
    if not state:
        raise HTTPException(status_code=404, detail="Competition not found")
    
    return {
        "competition": {
            "id": str(state['competition'].id),
            "name": state['competition'].name,
            "status": state['competition'].status,
            "current_round": state['competition'].current_round,
            "total_rounds": state['competition'].total_rounds,
            "red_team_score": state['competition'].red_team_score,
            "blue_team_score": state['competition'].blue_team_score,
            "time_remaining": state['time_remaining']
        },
        "red_team": [{"user_id": str(m.user_id), "score": m.score} for m in state['red_team']],
        "blue_team": [{"user_id": str(m.user_id), "score": m.score} for m in state['blue_team']],
        "current_actions": [{
            "user_id": str(a.user_id),
            "action_type": a.action_type,
            "target": a.target,
            "description": a.description,
            "points_awarded": a.points_awarded,
            "is_successful": a.is_successful,
            "timestamp": a.timestamp
        } for a in state['current_actions']]
    }

@router.get("/actions/{team}")
def get_available_actions(
    team: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = RedBlueService(db)
    return service.get_available_actions(team)

@router.post("/competition/{competition_id}/advance")
def advance_round(
    competition_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = RedBlueService(db)
    competition = service.advance_round(competition_id)
    
    if not competition:
        raise HTTPException(status_code=404, detail="Competition not found")
    
    return {
        "current_round": competition.current_round,
        "status": competition.status,
        "round_end_time": competition.round_end_time
    }