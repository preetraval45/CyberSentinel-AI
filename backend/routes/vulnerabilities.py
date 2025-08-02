from fastapi import APIRouter, Depends
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter()

@router.get("/")
def get_vulnerabilities(current_user: User = Depends(get_current_user)):
    return {"vulnerabilities": []}

@router.post("/scan")
def scan_vulnerabilities(current_user: User = Depends(get_current_user)):
    return {"message": "Vulnerability scan initiated"}