from sqlalchemy.orm import Session
from models.team_simulation import TeamEnvironment, SocialAttackMessage
from datetime import datetime
import random

class TeamSimulationService:
    def __init__(self, db: Session):
        self.db = db

    def create_team_environment(self, user_id: str, platform: str = 'slack'):
        colleagues = [
            {"name": "Sarah Johnson", "role": "HR Manager", "avatar": "👩‍💼", "status": "online"},
            {"name": "Mike Chen", "role": "IT Admin", "avatar": "👨‍💻", "status": "away"},
            {"name": "Lisa Rodriguez", "role": "Finance Director", "avatar": "👩‍💼", "status": "online"},
            {"name": "David Kim", "role": "CEO", "avatar": "👨‍💼", "status": "busy"},
            {"name": "Emma Wilson", "role": "Security Analyst", "avatar": "👩‍🔬", "status": "online"}
        ]
        
        channels = [
            {"name": "general", "type": "public", "members": 45},
            {"name": "it-support", "type": "public", "members": 12},
            {"name": "finance-team", "type": "private", "members": 8},
            {"name": "urgent-requests", "type": "public", "members": 23}
        ]

        environment = TeamEnvironment(
            user_id=user_id,
            platform=platform,
            team_name="CyberCorp Inc.",
            colleagues=colleagues,
            channels=channels
        )
        
        self.db.add(environment)
        self.db.commit()
        self.db.refresh(environment)
        return environment

    def generate_social_attack(self, environment_id: str, attack_type: str = None):
        environment = self.db.query(TeamEnvironment).filter(TeamEnvironment.id == environment_id).first()
        if not environment:
            return None

        attack_type = attack_type or random.choice(['credential_harvest', 'malware_link', 'urgent_request'])
        colleague = random.choice(environment.colleagues)
        channel = random.choice(environment.channels)

        messages = {
            'credential_harvest': [
                f"Hey! IT needs everyone to verify their login credentials. Please click here to update: http://company-login.fake/verify",
                f"Security alert! Your password expires today. Update it here: http://password-reset.scam/update",
                f"New company policy requires 2FA setup. Click to configure: http://2fa-setup.malicious/config"
            ],
            'malware_link': [
                f"Check out this funny video from the office party! 😂 http://office-party.exe/video",
                f"Important document for tomorrow's meeting: http://meeting-docs.zip/download",
                f"New employee handbook is ready: http://handbook.pdf.exe/view"
            ],
            'urgent_request': [
                f"URGENT: CEO needs gift cards for client meeting. Can you buy $500 iTunes cards and send codes ASAP?",
                f"Emergency wire transfer needed! Client payment failed. Need your help to process $2000 transfer immediately.",
                f"Quick favor - can you share your login so I can access the quarterly reports? Meeting in 10 mins!"
            ]
        }

        message_content = random.choice(messages[attack_type])
        
        attack_message = SocialAttackMessage(
            environment_id=environment_id,
            sender_name=colleague["name"],
            sender_role=colleague["role"],
            channel=channel["name"],
            message_content=message_content,
            attack_type=attack_type
        )
        
        self.db.add(attack_message)
        self.db.commit()
        self.db.refresh(attack_message)
        return attack_message

    def handle_message_action(self, message_id: str, action: str, response_text: str = None):
        message = self.db.query(SocialAttackMessage).filter(SocialAttackMessage.id == message_id).first()
        if not message:
            return None

        if action == 'click':
            message.is_clicked = True
            message.clicked_at = datetime.utcnow()
        elif action == 'report':
            message.is_reported = True
            message.reported_at = datetime.utcnow()
        elif action == 'respond':
            message.user_response = response_text

        self.db.commit()
        return message

    def get_environment_messages(self, environment_id: str):
        return self.db.query(SocialAttackMessage).filter(
            SocialAttackMessage.environment_id == environment_id
        ).order_by(SocialAttackMessage.created_at.desc()).all()

    def get_user_environment(self, user_id: str):
        return self.db.query(TeamEnvironment).filter(TeamEnvironment.user_id == user_id).first()