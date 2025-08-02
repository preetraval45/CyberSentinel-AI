from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from config.database import get_db
from models.user import User, UserRole
from utils.auth import verify_token
from functools import wraps

def get_current_user_with_role(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    
    email = verify_token(token)
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

def superadmin_required(current_user: User = Depends(get_current_user_with_role)):
    if current_user.role != UserRole.SUPERADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="SuperAdmin access required")
    return current_user

def user_required(current_user: User = Depends(get_current_user_with_role)):
    if current_user.role not in [UserRole.SUPERADMIN, UserRole.USER]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User access required")
    return current_user

def limited_user_required(current_user: User = Depends(get_current_user_with_role)):
    if current_user.role not in [UserRole.SUPERADMIN, UserRole.USER, UserRole.LIMITEDUSER]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Authentication required")
    return current_user