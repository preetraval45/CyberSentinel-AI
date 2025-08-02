from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from config.database import Base
import uuid

class VoiceCall(Base):
    __tablename__ = "voice_calls"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    scenario_type = Column(String(50), nullable=False)  # 'tech_support', 'bank_fraud', 'prize_scam'
    difficulty_level = Column(Integer, default=1)
    audio_prompt_url = Column(String(500))
    transcript = Column(Text)
    user_response_audio_url = Column(String(500))
    user_response_transcript = Column(Text)
    ai_score = Column(Float, default=0.0)
    vulnerability_score = Column(Float, default=0.0)
    is_completed = Column(Boolean, default=False)
    call_duration = Column(Float)  # seconds
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))

class VoiceCallFeedback(Base):
    __tablename__ = "voice_call_feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    call_id = Column(UUID(as_uuid=True), ForeignKey('voice_calls.id', ondelete='CASCADE'), nullable=False)
    feedback_type = Column(String(50), nullable=False)  # 'vulnerability', 'strength', 'improvement'
    message = Column(Text, nullable=False)
    score_impact = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())