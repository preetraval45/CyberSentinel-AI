from sqlalchemy.orm import Session
from models.phishing import PhishingEmail
from datetime import datetime
import random

class PhishingService:
    def __init__(self, db: Session):
        self.db = db

    def generate_phishing_email(self, user_id: str, difficulty: str = "beginner"):
        templates = {
            "beginner": [
                {
                    "subject": "Urgent: Verify Your Account",
                    "sender": "security@bank-alert.com",
                    "content": "Your account has been compromised. Click here to verify: http://fake-bank.com/verify",
                    "type": "credential_theft"
                }
            ],
            "intermediate": [
                {
                    "subject": "IT Security Update Required",
                    "sender": "it-support@company.com",
                    "content": "Please update your security settings by clicking: http://company-update.net/login",
                    "type": "spear_phishing"
                }
            ],
            "advanced": [
                {
                    "subject": "Invoice #INV-2024-001",
                    "sender": "billing@trusted-vendor.com",
                    "content": "Please review the attached invoice. Download: http://invoice-portal.biz/download",
                    "type": "business_email_compromise"
                }
            ]
        }
        
        template = random.choice(templates.get(difficulty, templates["beginner"]))
        
        email = PhishingEmail(
            user_id=user_id,
            subject=template["subject"],
            sender=template["sender"],
            content=template["content"],
            phishing_type=template["type"],
            difficulty_level=difficulty
        )
        
        self.db.add(email)
        self.db.commit()
        self.db.refresh(email)
        return email

    def get_user_emails(self, user_id: str):
        return self.db.query(PhishingEmail).filter(PhishingEmail.user_id == user_id).all()

    def track_click(self, email_id: str):
        email = self.db.query(PhishingEmail).filter(PhishingEmail.id == email_id).first()
        if email:
            email.is_clicked = True
            email.clicked_at = datetime.utcnow()
            self.db.commit()
        return email

    def report_phishing(self, email_id: str):
        email = self.db.query(PhishingEmail).filter(PhishingEmail.id == email_id).first()
        if email:
            email.is_reported = True
            email.reported_at = datetime.utcnow()
            self.db.commit()
        return email