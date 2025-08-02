from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from config.database import Base
import uuid

class SecurityBehaviorProfile(Base):
    __tablename__ = "security_behavior_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    
    # Vulnerability Scores (0.0 - 1.0)
    urgency_susceptibility = Column(Float, default=0.5)
    authority_susceptibility = Column(Float, default=0.5)
    curiosity_susceptibility = Column(Float, default=0.5)
    fear_susceptibility = Column(Float, default=0.5)
    trust_susceptibility = Column(Float, default=0.5)
    
    # Behavioral Patterns
    avg_response_time = Column(Float, default=30.0)  # seconds
    click_rate = Column(Float, default=0.3)
    report_rate = Column(Float, default=0.7)
    
    # Learning Metrics
    improvement_rate = Column(Float, default=0.0)
    plateau_threshold = Column(Float, default=0.1)
    challenge_preference = Column(String(20), default='adaptive')  # 'easy', 'medium', 'hard', 'adaptive'
    
    # Context Awareness
    time_of_day_patterns = Column(JSONB, default=dict)
    device_patterns = Column(JSONB, default=dict)
    stress_indicators = Column(JSONB, default=dict)
    
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class BehaviorEvent(Base):
    __tablename__ = "behavior_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    event_type = Column(String(50), nullable=False)  # 'click', 'report', 'ignore', 'hesitate'
    simulation_type = Column(String(50), nullable=False)
    triggers_present = Column(JSONB, default=list)
    response_time = Column(Float)
    context_data = Column(JSONB, default=dict)  # time_of_day, device, etc.
    success_score = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())