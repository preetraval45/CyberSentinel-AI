from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from config.database import Base
import uuid

class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    difficulty_level = Column(String(20))
    scenario_type = Column(String(50), nullable=False)
    content = Column(JSONB, nullable=False)
    is_active = Column(Boolean, default=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("difficulty_level IN ('beginner', 'intermediate', 'advanced')"),
    )

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    scenario_id = Column(UUID(as_uuid=True), ForeignKey('scenarios.id', ondelete='CASCADE'), nullable=False)
    status = Column(String(20))
    score = Column(Integer)
    time_taken = Column(Integer)  # in seconds
    responses = Column(JSONB)
    feedback = Column(Text)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("status IN ('in_progress', 'completed', 'failed', 'abandoned')"),
        CheckConstraint("score >= 0 AND score <= 100"),
    )