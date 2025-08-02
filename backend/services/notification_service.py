from pywebpush import webpush, WebPushException
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict

class NotificationService:
    VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY")
    VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
    VAPID_CLAIMS = {"sub": "mailto:admin@cybersentinel.ai"}
    
    @staticmethod
    def create_notification(user_id: int, type: str, title: str, message: str, data: Dict = None):
        # Save to database
        notification = {
            "id": 1,
            "user_id": user_id,
            "type": type,
            "title": title,
            "message": message,
            "data": data or {},
            "created_at": datetime.utcnow()
        }
        return notification
    
    @staticmethod
    def send_push_notification(subscription: Dict, payload: Dict):
        try:
            webpush(
                subscription_info=subscription,
                data=json.dumps(payload),
                vapid_private_key=NotificationService.VAPID_PRIVATE_KEY,
                vapid_claims=NotificationService.VAPID_CLAIMS
            )
            return True
        except WebPushException as ex:
            print(f"Push notification failed: {ex}")
            return False
    
    @staticmethod
    def generate_training_reminder(user_id: int):
        return NotificationService.create_notification(
            user_id=user_id,
            type="training_reminder",
            title="Training Reminder",
            message="Complete your weekly cybersecurity training",
            data={"action_url": "/training"}
        )
    
    @staticmethod
    def generate_risk_alert(user_id: int, risk_type: str, severity: str):
        return NotificationService.create_notification(
            user_id=user_id,
            type="risk_alert",
            title=f"Security Alert: {risk_type}",
            message=f"High {severity} risk detected in your environment",
            data={"risk_type": risk_type, "severity": severity}
        )
    
    @staticmethod
    def get_user_notifications(user_id: int, unread_only: bool = False) -> List[Dict]:
        # Mock notifications
        return [
            {
                "id": 1,
                "type": "training_reminder",
                "title": "Weekly Training Due",
                "message": "Complete your phishing detection training",
                "read": False,
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": 2,
                "type": "new_simulation",
                "title": "New Simulation Available",
                "message": "Try the new ransomware response scenario",
                "read": True,
                "created_at": (datetime.utcnow() - timedelta(hours=2)).isoformat()
            }
        ]