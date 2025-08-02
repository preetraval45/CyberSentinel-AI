from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config.database import get_db
from services.ai_workflow import AIWorkflowService
from middleware.auth_middleware import get_current_user
from models.user import User
from typing import Dict, Any, Optional

router = APIRouter()

class StartSessionRequest(BaseModel):
    context: str = "security_analysis"

class ExecuteTaskRequest(BaseModel):
    task_id: str
    user_input: Optional[Dict[str, Any]] = None

@router.post("/session/start")
def start_ai_session(
    request: StartSessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start new AI workflow session"""
    workflow = AIWorkflowService()
    result = workflow.start_session(str(current_user.id), request.context)
    return result

@router.get("/session/resume")
def resume_ai_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Resume existing AI workflow session"""
    workflow = AIWorkflowService()
    result = workflow.resume_session()
    return result

@router.get("/session/state")
def get_session_state(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current AI workflow session state"""
    workflow = AIWorkflowService()
    return workflow.get_session_state()

@router.get("/next-steps")
def get_next_steps(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get actionable next steps"""
    workflow = AIWorkflowService()
    return {"next_steps": workflow.get_next_steps()}

@router.post("/task/execute")
def execute_task(
    request: ExecuteTaskRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Execute specific AI workflow task"""
    workflow = AIWorkflowService()
    result = workflow.execute_task(request.task_id, request.user_input)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result