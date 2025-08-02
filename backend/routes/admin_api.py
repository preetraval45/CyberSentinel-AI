from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from config.database import get_db
from models.user import User, UserRole
from middleware.rbac import superadmin_required

router = APIRouter()

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    created_at: datetime
    last_login: Optional[datetime] = None

class RoleUpdateRequest(BaseModel):
    user_id: str
    role: UserRole

class ModuleResponse(BaseModel):
    id: str
    name: str
    description: str
    active: bool
    completion_rate: float

class LogEntry(BaseModel):
    id: str
    user_email: str
    action: str
    timestamp: datetime
    ip_address: str

@router.get("/users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db), current_user: User = Depends(superadmin_required)):
    users = db.query(User).all()
    return [
        UserResponse(
            id=str(user.id),
            email=user.email,
            role=user.role.value,
            created_at=user.created_at,
            last_login=user.last_login
        ) for user in users
    ]

@router.put("/users/role")
def update_user_role(
    request: RoleUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(superadmin_required)
):
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = request.role
    db.commit()
    return {"message": "Role updated successfully"}

@router.delete("/users/{user_id}")
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(superadmin_required)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.get("/modules", response_model=List[ModuleResponse])
def get_training_modules(current_user: User = Depends(superadmin_required)):
    # Mock data - replace with actual database query
    return [
        ModuleResponse(id="1", name="Phishing Awareness", description="Email security training", active=True, completion_rate=85.5),
        ModuleResponse(id="2", name="Password Security", description="Strong password practices", active=True, completion_rate=92.3),
        ModuleResponse(id="3", name="Social Engineering", description="Human factor security", active=False, completion_rate=67.8)
    ]

@router.get("/logs", response_model=List[LogEntry])
def get_access_logs(
    limit: int = 100,
    current_user: User = Depends(superadmin_required)
):
    # Mock data - replace with actual log query
    return [
        LogEntry(id="1", user_email="user@example.com", action="LOGIN", timestamp=datetime.now(), ip_address="192.168.1.100"),
        LogEntry(id="2", user_email="admin@example.com", action="ROLE_UPDATE", timestamp=datetime.now(), ip_address="192.168.1.101"),
        LogEntry(id="3", user_email="test@example.com", action="MODULE_COMPLETE", timestamp=datetime.now(), ip_address="192.168.1.102")
    ]

@router.get("/analytics")
def get_analytics(current_user: User = Depends(superadmin_required)):
    return {
        "total_users": 156,
        "active_users": 89,
        "completed_trainings": 234,
        "security_incidents": 12,
        "user_growth": [
            {"month": "Jan", "users": 120},
            {"month": "Feb", "users": 135},
            {"month": "Mar", "users": 156}
        ]
    }

@router.get("/export/users")
def export_users_report(current_user: User = Depends(superadmin_required)):
    return {"download_url": "/api/admin/download/users.csv", "expires_at": datetime.now()}

@router.get("/export/logs")
def export_logs_report(current_user: User = Depends(superadmin_required)):
    return {"download_url": "/api/admin/download/logs.csv", "expires_at": datetime.now()}