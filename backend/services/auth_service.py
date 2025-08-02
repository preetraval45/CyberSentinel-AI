from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.user import User, RefreshToken
from utils.auth import verify_password, get_password_hash, create_access_token, create_refresh_token

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register_user(self, email: str, password: str):
        if self.db.query(User).filter(User.email == email).first():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = get_password_hash(password)
        user = User(email=email, password_hash=hashed_password)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def authenticate_user(self, email: str, password: str):
        user = self.db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            return False
        return user

    def create_tokens(self, user: User):
        access_token = create_access_token(data={"sub": user.email})
        refresh_token = create_refresh_token()
        
        # Store refresh token
        expires_at = datetime.utcnow() + timedelta(days=7)
        db_token = RefreshToken(
            user_id=user.id,
            token=refresh_token,
            expires_at=expires_at
        )
        self.db.add(db_token)
        self.db.commit()
        
        return {"access_token": access_token, "refresh_token": refresh_token}

    def refresh_access_token(self, refresh_token: str):
        db_token = self.db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
        if not db_token or db_token.expires_at < datetime.utcnow():
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        user = self.db.query(User).filter(User.id == db_token.user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token}

    def revoke_refresh_token(self, refresh_token: str):
        db_token = self.db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
        if db_token:
            self.db.delete(db_token)
            self.db.commit()