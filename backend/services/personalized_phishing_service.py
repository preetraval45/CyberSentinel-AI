from sqlalchemy.orm import Session
from models.phishing import PhishingEmail
from models.user_profile import UserProfile
from models.user import User
import openai
import os
import json
from datetime import datetime

class PersonalizedPhishingService:
    def __init__(self, db: Session):
        self.db = db
        openai.api_key = os.getenv("OPENAI_API_KEY")

    def get_user_profile(self, user_id: str):
        return self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    def analyze_user_responses(self, user_id: str):
        emails = self.db.query(PhishingEmail).filter(PhishingEmail.user_id == user_id).limit(10).all()
        
        patterns = {
            'clicks_urgent': 0,
            'clicks_authority': 0,
            'clicks_personal': 0,
            'reports_suspicious': 0,
            'response_time_avg': 0
        }
        
        for email in emails:
            if email.is_clicked:
                if 'urgent' in email.subject.lower():
                    patterns['clicks_urgent'] += 1
                if any(word in email.sender.lower() for word in ['ceo', 'manager', 'admin']):
                    patterns['clicks_authority'] += 1
            if email.is_reported:
                patterns['reports_suspicious'] += 1
        
        return patterns

    def build_personalized_prompt(self, user_id: str, difficulty_level: int):
        profile = self.get_user_profile(user_id)
        patterns = self.analyze_user_responses(user_id)
        
        if not profile:
            return self.get_default_prompt(difficulty_level)

        prompt = f"""Generate a highly personalized phishing email targeting a {profile.job_role or 'professional'} in the {profile.industry or 'technology'} industry.

USER PROFILE:
- Job Role: {profile.job_role or 'Employee'}
- Department: {profile.department or 'General'}
- Company Size: {profile.company_size or 'Medium'}
- Industry: {profile.industry or 'Technology'}
- Location: {profile.location or 'United States'}
- Communication Style: {profile.communication_style or 'professional'}
- Language: {profile.language_preference or 'en'}

BEHAVIORAL PATTERNS:
- Clicks on urgent messages: {patterns.get('clicks_urgent', 0)} times
- Clicks on authority figures: {patterns.get('clicks_authority', 0)} times
- Reports suspicious emails: {patterns.get('reports_suspicious', 0)} times

DIFFICULTY LEVEL: {difficulty_level}/3

REQUIREMENTS:
1. Use industry-specific terminology and context
2. Reference location-appropriate services/companies
3. Match the user's communication style
4. Exploit identified vulnerability patterns
5. Include realistic sender addresses and company names
6. Make the attack vector appropriate for their job role

Generate a JSON response with:
{{
    "subject": "Email subject line",
    "sender": "sender@domain.com",
    "sender_name": "Sender Display Name",
    "content": "Email body content",
    "attack_vector": "Type of attack (credential_harvest, malware, etc.)",
    "psychological_triggers": ["urgency", "authority", "fear", etc.],
    "industry_context": "How this relates to their industry",
    "personalization_elements": ["specific elements tailored to user"]
}}"""

        return prompt

    def generate_personalized_email(self, user_id: str, difficulty_level: int = 1):
        prompt = self.build_personalized_prompt(user_id, difficulty_level)
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a cybersecurity training expert creating realistic phishing simulations for educational purposes."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=1000
            )
            
            content = response.choices[0].message.content
            email_data = json.loads(content)
            
            # Calculate AI click likelihood based on personalization
            click_likelihood = self.calculate_personalized_likelihood(user_id, email_data)
            
            email = PhishingEmail(
                user_id=user_id,
                subject=email_data["subject"],
                sender=email_data["sender"],
                content=email_data["content"],
                phishing_type=email_data["attack_vector"],
                difficulty_level=str(difficulty_level),
                ai_click_likelihood=click_likelihood
            )
            
            self.db.add(email)
            self.db.commit()
            self.db.refresh(email)
            
            # Update user profile with new response data
            self.update_user_patterns(user_id, email_data)
            
            return email, email_data
            
        except Exception as e:
            # Fallback to template-based generation
            return self.generate_fallback_email(user_id, difficulty_level)

    def calculate_personalized_likelihood(self, user_id: str, email_data: dict):
        base_likelihood = 0.5
        patterns = self.analyze_user_responses(user_id)
        
        # Adjust based on psychological triggers
        triggers = email_data.get("psychological_triggers", [])
        if "urgency" in triggers and patterns.get('clicks_urgent', 0) > 2:
            base_likelihood += 0.2
        if "authority" in triggers and patterns.get('clicks_authority', 0) > 1:
            base_likelihood += 0.15
        
        # Adjust based on personalization
        personalization = len(email_data.get("personalization_elements", []))
        base_likelihood += personalization * 0.05
        
        return min(0.95, max(0.1, base_likelihood))

    def update_user_patterns(self, user_id: str, email_data: dict):
        profile = self.get_user_profile(user_id)
        if profile:
            if not profile.vulnerability_patterns:
                profile.vulnerability_patterns = []
            
            profile.vulnerability_patterns.append({
                "timestamp": datetime.utcnow().isoformat(),
                "triggers": email_data.get("psychological_triggers", []),
                "attack_vector": email_data.get("attack_vector"),
                "personalization_score": len(email_data.get("personalization_elements", []))
            })
            
            # Keep only last 20 patterns
            profile.vulnerability_patterns = profile.vulnerability_patterns[-20:]
            self.db.commit()

    def get_default_prompt(self, difficulty_level: int):
        return f"""Generate a phishing email with difficulty level {difficulty_level}/3.
        
        Return JSON with: subject, sender, content, attack_vector, psychological_triggers."""

    def generate_fallback_email(self, user_id: str, difficulty_level: int):
        templates = {
            1: {
                "subject": "Account Security Alert",
                "sender": "security@company-alerts.com",
                "content": "Your account requires immediate verification. Click here to secure your account.",
                "attack_vector": "credential_harvest"
            }
        }
        
        template = templates.get(difficulty_level, templates[1])
        
        email = PhishingEmail(
            user_id=user_id,
            subject=template["subject"],
            sender=template["sender"],
            content=template["content"],
            phishing_type=template["attack_vector"],
            difficulty_level=str(difficulty_level),
            ai_click_likelihood=0.6
        )
        
        self.db.add(email)
        self.db.commit()
        self.db.refresh(email)
        
        return email, template