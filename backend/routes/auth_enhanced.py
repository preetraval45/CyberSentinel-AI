from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlalchemy.orm import Session
from database import get_db
from services.email_service import email_service
from services.audit_service import audit_service
from services.sso_service import sso_service
from services.stripe_service import stripe_service
import secrets
import hashlib
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/auth", tags=["Enhanced Auth"])

@router.post("/register")
async def register_with_verification(
    user_data: dict,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    request: Request = None
):
    # Create user with email_verified=False
    verification_token = secrets.token_urlsafe(32)
    
    # Store verification token in database
    # Create user logic here
    
    # Send verification email in background
    background_tasks.add_task(
        email_service.send_verification_email,
        user_data["email"],
        verification_token
    )
    
    # Log registration attempt
    audit_service.log_action(
        db, None, "REGISTER_ATTEMPT", "USER", 
        details={"email": user_data["email"]}, request=request
    )
    
    return {"message": "Registration successful. Please check your email to verify your account."}

@router.post("/verify-email")
async def verify_email(token: str, db: Session = Depends(get_db)):
    # Verify token and update user email_verified=True
    # Implementation here
    return {"message": "Email verified successfully"}

@router.get("/sso/{provider}")
async def sso_login(provider: str):
    if provider == "google":
        redirect_uri = f"{os.getenv('BACKEND_URL')}/api/auth/sso/google/callback"
        return {"auth_url": f"https://accounts.google.com/oauth2/auth?client_id={os.getenv('GOOGLE_CLIENT_ID')}&redirect_uri={redirect_uri}&scope=openid email profile&response_type=code"}
    # Similar for Azure and Okta
    raise HTTPException(status_code=400, detail="Unsupported provider")

@router.get("/sso/{provider}/callback")
async def sso_callback(provider: str, code: str, db: Session = Depends(get_db)):
    # Handle SSO callback and create/login user
    # Implementation here
    return {"access_token": "jwt_token", "token_type": "bearer"}

@router.post("/create-subscription")
async def create_subscription(
    price_id: str,
    user_id: int,
    db: Session = Depends(get_db)
):
    # Create Stripe customer and subscription
    customer = stripe_service.create_customer("user@example.com", "User Name")
    subscription = stripe_service.create_subscription(customer.id, price_id)
    
    return {"client_secret": subscription.latest_invoice.payment_intent.client_secret}

@router.get("/audit-logs")
async def get_audit_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_superadmin)  # SuperAdmin only
):
    logs = audit_service.get_audit_logs(db, skip, limit)
    return logs