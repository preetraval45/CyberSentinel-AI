from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from config.database import Base
import uuid

class PhishingEmail(Base):
    __tablename__ = "phishing_emails"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    subject = Column(String(255), nullable=False)
    sender = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    phishing_type = Column(String(50), nullable=False)
    difficulty_level = Column(String(20), nullable=False)
    is_clicked = Column(Boolean, default=False)
    is_reported = Column(Boolean, default=False)
    clicked_at = Column(DateTime(timezone=True))
    reported_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    scenario_type = Column(String(50), nullable=False)
    status = Column(String(20), default='active')
    ai_persona = Column(String(100), nullable=False)
    context = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True))

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey('chat_sessions.id', ondelete='CASCADE'), nullable=False)
    sender_type = Column(String(10), nullable=False)  # 'user' or 'ai'
    message = Column(Text, nullable=False)
    message_metadata = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
