from fastapi import APIRouter, Depends
from middleware.auth_middleware import get_current_user
from models.user import User
from services.ai_workflow import AIWorkflowService

router = APIRouter()

@router.post("/query")
def ai_query(current_user: User = Depends(get_current_user)):
    return {"response": "AI query processed"}

@router.get("/memory")
def get_memory(current_user: User = Depends(get_current_user)):
    workflow = AIWorkflowService()
    return workflow.get_session_state()