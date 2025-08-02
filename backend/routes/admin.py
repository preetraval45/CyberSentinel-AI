from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from services.analytics_service import AnalyticsService
from middleware.auth_middleware import get_current_user
from models.user import User
from fastapi.responses import JSONResponse
import json

router = APIRouter()

def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/analytics/overview")
def get_analytics_overview(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    service = AnalyticsService(db)
    return {
        'user_performance': service.get_user_performance_stats(),
        'attack_success': service.get_attack_success_rates(),
        'risk_scoring': service.get_risk_scoring(),
        'compliance': service.get_compliance_stats()
    }

@router.get("/analytics/activities")
def get_recent_activities(
    limit: int = 20,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    service = AnalyticsService(db)
    return service.get_recent_activities(limit)

@router.get("/reports/compliance")
def generate_compliance_report(
    report_type: str = 'all',
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    service = AnalyticsService(db)
    report = service.generate_compliance_report(report_type)
    
    return JSONResponse(
        content=report,
        headers={
            'Content-Disposition': f'attachment; filename=compliance_report_{report_type}.json'
        }
    )

@router.get("/users/management")
def get_users_for_management(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()
    return [{
        'id': str(user.id),
        'email': user.email,
        'role': user.role,
        'is_active': user.is_active,
        'is_admin': user.is_admin,
        'created_at': user.created_at,
        'last_login': user.last_login
    } for user in users]

@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: str,
    role: str,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = role
    if role == 'admin':
        user.is_admin = True
    else:
        user.is_admin = False
    
    db.commit()
    return {'message': 'User role updated successfully'}

@router.put("/users/{user_id}/status")
def update_user_status(
    user_id: str,
    is_active: bool,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = is_active
    db.commit()
    return {'message': 'User status updated successfully'}