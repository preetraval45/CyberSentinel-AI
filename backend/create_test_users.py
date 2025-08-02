#!/usr/bin/env python3

from sqlalchemy.orm import Session
from config.database import engine, get_db
from models.user import User, UserRole
from utils.auth import get_password_hash

def create_test_users():
    db = Session(bind=engine)
    
    test_users = [
        {"email": "superadmin", "password": "Super@123", "role": UserRole.SUPERADMIN},
        {"email": "testuser", "password": "User@123", "role": UserRole.USER},
        {"email": "limited", "password": "Limit@123", "role": UserRole.LIMITEDUSER}
    ]
    
    for user_data in test_users:
        existing_user = db.query(User).filter(User.email == user_data["email"]).first()
        if existing_user:
            print(f"User {user_data['email']} already exists, skipping...")
            continue
            
        hashed_password = get_password_hash(user_data["password"])
        user = User(
            email=user_data["email"],
            password_hash=hashed_password,
            role=user_data["role"]
        )
        db.add(user)
        print(f"Created user: {user_data['email']} with role: {user_data['role'].value}")
    
    db.commit()
    db.close()
    print("Test users created successfully!")

if __name__ == "__main__":
    create_test_users()