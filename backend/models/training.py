from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from config.database import Base
import uuid

class TrainingScenario(Base):
    __tablename__ = "training_scenarios"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)  # physical, insider, malware, ransomware, wifi, compliance
    difficulty = Column(String(20), nullable=False)
    scenario_data = Column(JSONB, nullable=False)  # Branching logic and content
    ai_adaptive = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    scenario_id = Column(UUID(as_uuid=True), ForeignKey('training_scenarios.id', ondelete='CASCADE'), nullable=False)
    current_step = Column(String(50), default='start')
    decisions_made = Column(JSONB, default={})
    score = Column(Integer, default=0)
    completion_rate = Column(Float, default=0.0)
    time_spent = Column(Integer, default=0)  # seconds
    status = Column(String(20), default='in_progress')
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))

class DecisionOutcome(Base):
    __tablename__ = "decision_outcomes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    progress_id = Column(UUID(as_uuid=True), ForeignKey('user_progress.id', ondelete='CASCADE'), nullable=False)
    step_id = Column(String(50), nullable=False)
    decision = Column(String(255), nullable=False)
    outcome = Column(Text, nullable=False)
    points_awarded = Column(Integer, default=0)
    is_correct = Column(Boolean, nullable=False)
    ai_feedback = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ComplianceQuiz(Base):
    __tablename__ = "compliance_quizzes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    quiz_type = Column(String(50), nullable=False)  # gdpr, hipaa, sox, pci
    questions = Column(JSONB, nullable=False)
    answers = Column(JSONB, nullable=False)
    score = Column(Integer, nullable=False)
    passed = Column(Boolean, nullable=False)
    certificate_issued = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())