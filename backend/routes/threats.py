from fastapi import APIRouter, Depends
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter()

@router.get("/")
def get_threats(current_user: User = Depends(get_current_user)):
    return {"threats": []}

@router.post("/scan")
def scan_threats(current_user: User = Depends(get_current_user)):
    return {"message": "Threat scan initiated"}