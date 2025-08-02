from fastapi import HTTPException, status, Depends
from sqlalchemy.orm import Session
from config.database import get_db
from models.user import User, UserRole
from utils.auth import get_current_user

def superadmin_required(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.SUPERADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="SuperAdmin access required"
        )
    return current_user

def user_required(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.USER, UserRole.SUPERADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User access required"
        )
    return current_user

def limited_user_required(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.LIMITEDUSER, UserRole.USER, UserRole.SUPERADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Limited user access required"
        )
    return current_user