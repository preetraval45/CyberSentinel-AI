from fastapi import APIRouter, Depends
from middleware.auth_middleware import get_current_user
from models.user import User
from ai_controller import AIController

router = APIRouter()
ai_controller = AIController()

@router.post("/query")
def ai_query(current_user: User = Depends(get_current_user)):
    return {"response": "AI query processed"}

@router.get("/memory")
def get_memory(current_user: User = Depends(get_current_user)):
    return ai_controller.state