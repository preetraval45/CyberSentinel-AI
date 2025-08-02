from sqlalchemy.orm import Session
from models.phishing import ChatSession, ChatMessage
from datetime import datetime
import openai
import os

class ChatService:
    def __init__(self, db: Session):
        self.db = db
        openai.api_key = os.getenv("OPENAI_API_KEY")

    def create_session(self, user_id: str, scenario_type: str, ai_persona: str):
        session = ChatSession(
            user_id=user_id,
            scenario_type=scenario_type,
            ai_persona=ai_persona,
            context={"messages": []}
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def send_message(self, session_id: str, message: str, sender_type: str):
        chat_message = ChatMessage(
            session_id=session_id,
            sender_type=sender_type,
            message=message
        )
        self.db.add(chat_message)
        self.db.commit()
        return chat_message

    def generate_ai_response(self, session_id: str, user_message: str):
        session = self.db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if not session:
            return None

        # Store user message
        self.send_message(session_id, user_message, "user")

        # Generate AI response
        persona_prompts = {
            "fake_tech_support": "You are a fake tech support scammer trying to gain remote access to the user's computer. Be convincing but use social engineering tactics.",
            "phishing_caller": "You are a scammer calling about suspicious bank activity. Try to get personal information through urgency and fear.",
            "fake_recruiter": "You are a fake recruiter trying to get personal information for identity theft. Be professional but ask for sensitive details."
        }

        prompt = persona_prompts.get(session.ai_persona, "You are a social engineering attacker.")
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=150
            )
            ai_response = response.choices[0].message.content
        except:
            ai_response = "I understand your concern. Can you provide more details about your account?"

        # Store AI response
        ai_message = self.send_message(session_id, ai_response, "ai")
        return ai_message

    def get_session_messages(self, session_id: str):
        return self.db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at).all()

    def end_session(self, session_id: str):
        session = self.db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if session:
            session.status = "ended"
            session.ended_at = datetime.utcnow()
            self.db.commit()
        return session