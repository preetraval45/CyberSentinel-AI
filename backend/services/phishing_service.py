from sqlalchemy.orm import Session
from models.phishing import PhishingEmail, PhishingGameSession, PhishingAlert
from datetime import datetime
import random
import time

class PhishingService:
    def __init__(self, db: Session):
        self.db = db

    def calculate_ai_click_likelihood(self, subject: str, sender: str, content: str, difficulty: str) -> float:
        """AI-powered click likelihood prediction"""
        base_likelihood = {"beginner": 0.8, "intermediate": 0.6, "advanced": 0.4}[difficulty]
        
        # Urgency indicators
        urgency_words = ["urgent", "immediate", "expire", "suspend", "verify", "act now"]
        urgency_score = sum(1 for word in urgency_words if word.lower() in (subject + content).lower()) * 0.1
        
        # Legitimacy indicators
        suspicious_domains = [".net", "-alert", "fake", "scam"]
        suspicion_score = sum(1 for domain in suspicious_domains if domain in sender.lower()) * 0.15
        
        return min(0.95, base_likelihood + urgency_score + suspicion_score)

    def generate_phishing_email(self, user_id: str, difficulty_level: int = 1):
        difficulty_map = {1: "beginner", 2: "intermediate", 3: "advanced"}
        difficulty = difficulty_map.get(difficulty_level, "beginner")
        
        templates = {
            "beginner": [
                {
                    "subject": "Urgent: Verify Your Account",
                    "sender": "security@bank-alert.com",
                    "content": "Your account has been compromised. Click here to verify: http://fake-bank.com/verify",
                    "type": "credential_theft"
                },
                {
                    "subject": "You've Won $1,000,000!",
                    "sender": "winner@lottery-scam.net",
                    "content": "Congratulations! Claim your prize now: http://fake-lottery.com/claim",
                    "type": "lottery_scam"
                }
            ],
            "intermediate": [
                {
                    "subject": "IT Security Update Required",
                    "sender": "it-support@company.com",
                    "content": "Please update your security settings: http://company-update.net/login",
                    "type": "spear_phishing"
                },
                {
                    "subject": "Password Expiration Notice",
                    "sender": "admin@corporate-mail.org",
                    "content": "Your password expires in 24 hours. Update now: http://password-reset.biz",
                    "type": "credential_harvesting"
                }
            ],
            "advanced": [
                {
                    "subject": "Invoice #INV-2024-001",
                    "sender": "billing@trusted-vendor.com",
                    "content": "Please review the attached invoice. Download: http://invoice-portal.biz/download",
                    "type": "business_email_compromise"
                },
                {
                    "subject": "Re: Contract Amendment",
                    "sender": "legal@partner-firm.co",
                    "content": "Please review and sign the updated contract: http://secure-docs.net/sign",
                    "type": "document_fraud"
                }
            ]
        }
        
        template = random.choice(templates.get(difficulty, templates["beginner"]))
        ai_likelihood = self.calculate_ai_click_likelihood(
            template["subject"], template["sender"], template["content"], difficulty
        )
        
        email = PhishingEmail(
            user_id=user_id,
            subject=template["subject"],
            sender=template["sender"],
            content=template["content"],
            phishing_type=template["type"],
            difficulty_level=difficulty,
            ai_click_likelihood=ai_likelihood
        )
        
        self.db.add(email)
        self.db.commit()
        self.db.refresh(email)
        return email

    def get_user_emails(self, user_id: str):
        return self.db.query(PhishingEmail).filter(PhishingEmail.user_id == user_id).all()

    def track_click(self, email_id: str, user_id: str, response_time: float = None):
        email = self.db.query(PhishingEmail).filter(PhishingEmail.id == email_id).first()
        if email:
            email.is_clicked = True
            email.clicked_at = datetime.utcnow()
            
            # Create alert with feedback
            feedback = self.generate_click_feedback(email)
            alert = PhishingAlert(
                user_id=user_id,
                email_id=email_id,
                alert_type="click",
                response_time=response_time,
                feedback_message=feedback["message"],
                xp_awarded=feedback["xp"]
            )
            
            self.db.add(alert)
            self.db.commit()
            return {"email": email, "alert": alert, "feedback": feedback}
        return None

    def report_phishing(self, email_id: str, user_id: str, response_time: float = None):
        email = self.db.query(PhishingEmail).filter(PhishingEmail.id == email_id).first()
        if email:
            email.is_reported = True
            email.reported_at = datetime.utcnow()
            
            # Create alert with feedback
            feedback = self.generate_report_feedback(email)
            alert = PhishingAlert(
                user_id=user_id,
                email_id=email_id,
                alert_type="report",
                response_time=response_time,
                feedback_message=feedback["message"],
                xp_awarded=feedback["xp"]
            )
            
            self.db.add(alert)
            self.db.commit()
            return {"email": email, "alert": alert, "feedback": feedback}
        return None

    def generate_click_feedback(self, email: PhishingEmail):
        """Generate feedback for clicking malicious links"""
        messages = {
            "beginner": "⚠️ Malicious link clicked! This was an obvious phishing attempt. Look for suspicious domains and urgent language.",
            "intermediate": "⚠️ Sophisticated attack detected! This email used social engineering tactics. Always verify sender identity.",
            "advanced": "⚠️ Advanced threat bypassed! This was a highly targeted attack. Consider additional security training."
        }
        return {
            "message": messages.get(email.difficulty_level, messages["beginner"]),
            "xp": -10,
            "type": "danger"
        }

    def generate_report_feedback(self, email: PhishingEmail):
        """Generate feedback for reporting phishing"""
        xp_rewards = {"beginner": 25, "intermediate": 35, "advanced": 50}
        messages = {
            "beginner": "🎉 Excellent! You correctly identified this phishing attempt. Keep up the good work!",
            "intermediate": "🎉 Great detection! You spotted the social engineering tactics used in this attack.",
            "advanced": "🎉 Outstanding! You identified a sophisticated threat that could fool many users."
        }
        return {
            "message": messages.get(email.difficulty_level, messages["beginner"]),
            "xp": xp_rewards.get(email.difficulty_level, 25),
            "type": "success"
        }

    def get_or_create_game_session(self, user_id: str):
        """Get active game session or create new one"""
        session = self.db.query(PhishingGameSession).filter(
            PhishingGameSession.user_id == user_id,
            PhishingGameSession.ended_at.is_(None)
        ).first()
        
        if not session:
            session = PhishingGameSession(user_id=user_id)
            self.db.add(session)
            self.db.commit()
            self.db.refresh(session)
        
        return session

    def update_game_session(self, user_id: str, action: str, xp_change: int):
        """Update game session stats"""
        session = self.get_or_create_game_session(user_id)
        session.score += xp_change
        session.emails_processed += 1
        
        if action == "report":
            session.correct_identifications += 1
        elif action == "click":
            session.clicks_on_malicious += 1
            
        self.db.commit()
        return session