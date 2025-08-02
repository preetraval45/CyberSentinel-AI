from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from config.database import get_db
from services.auth_service import AuthService
from middleware.auth_middleware import get_current_user
from middleware.rbac import superadmin_required, user_required, limited_user_required
from models.user import User, UserRole

router = APIRouter()

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegisterWithRole(BaseModel):
    email: EmailStr
    password: str
    role: UserRole = UserRole.USER

class RoleUpdate(BaseModel):
    user_id: str
    role: UserRole

@router.get("/status")
def auth_status(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        return {"authenticated": False}
    
    try:
        from utils.auth import verify_token
        email = verify_token(token)
        user = db.query(User).filter(User.email == email).first()
        if user:
            return {"authenticated": True, "user": {"id": str(user.id), "email": user.email, "role": user.role.value}}
    except:
        pass
    
    return {"authenticated": False}

@router.post("/register")
def register(user_data: UserRegister, response: Response, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user = auth_service.register_user(user_data.email, user_data.password)
    tokens = auth_service.create_tokens(user)
    
    response.set_cookie(
        key="access_token",
        value=tokens["access_token"],
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=15 * 60  # 15 minutes
    )
    
    return {"message": "User registered successfully", "user": {"id": str(user.id), "email": user.email, "role": user.role.value}}

@router.post("/login")
def login(user_data: UserLogin, response: Response, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user = auth_service.authenticate_user(user_data.email, user_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    tokens = auth_service.create_tokens(user)
    
    response.set_cookie(
        key="access_token",
        value=tokens["access_token"],
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=15 * 60  # 15 minutes
    )
    
    return {"message": "Login successful", "user": {"id": str(user.id), "email": user.email, "role": user.role.value}}

@router.post("/refresh")
def refresh_token(token_data: RefreshTokenRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    tokens = auth_service.refresh_access_token(token_data.refresh_token)
    return tokens

@router.post("/logout")
def logout(response: Response, current_user: User = Depends(get_current_user)):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out successfully"}

@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {"id": str(current_user.id), "email": current_user.email, "role": current_user.role.value}

@router.post("/assign-role")
def assign_role(role_data: RoleUpdate, db: Session = Depends(get_db), current_user: User = Depends(superadmin_required)):
    user = db.query(User).filter(User.id == role_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = role_data.role
    db.commit()
    return {"message": "Role updated successfully", "user": {"id": str(user.id), "email": user.email, "role": user.role.value}}