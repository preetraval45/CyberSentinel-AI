from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from config.database import get_db
from services.auth_service import AuthService
from middleware.auth_middleware import get_current_user
from models.user import User

router = APIRouter()

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

@router.post("/register")
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user = auth_service.register_user(user_data.email, user_data.password)
    tokens = auth_service.create_tokens(user)
    return {"message": "User registered successfully", "tokens": tokens}

@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user = auth_service.authenticate_user(user_data.email, user_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    tokens = auth_service.create_tokens(user)
    return {"message": "Login successful", "tokens": tokens}

@router.post("/refresh")
def refresh_token(token_data: RefreshTokenRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    tokens = auth_service.refresh_access_token(token_data.refresh_token)
    return tokens

@router.post("/logout")
def logout(token_data: RefreshTokenRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    auth_service.revoke_refresh_token(token_data.refresh_token)
    return {"message": "Logged out successfully"}

@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {"id": str(current_user.id), "email": current_user.email, "role": current_user.role}