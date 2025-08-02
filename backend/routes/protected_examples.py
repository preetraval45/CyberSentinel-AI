from fastapi import APIRouter, Depends
from middleware.rbac import superadmin_required, user_required, limited_user_required
from models.user import User

router = APIRouter()

@router.get("/superadmin-only")
def superadmin_endpoint(current_user: User = Depends(superadmin_required)):
    return {"message": "SuperAdmin access granted", "user": current_user.email}

@router.get("/user-access")
def user_endpoint(current_user: User = Depends(user_required)):
    return {"message": "User access granted", "user": current_user.email, "role": current_user.role.value}

@router.get("/limited-access")
def limited_endpoint(current_user: User = Depends(limited_user_required)):
    return {"message": "Limited access granted", "user": current_user.email, "role": current_user.role.value}