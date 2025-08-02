from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from config.database import Base
import uuid

class RansomwareSimulation(Base):
    __tablename__ = "ransomware_simulations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    scenario_type = Column(String(50), nullable=False)  # 'crypto_locker', 'file_encrypt', 'system_lock'
    difficulty_level = Column(Integer, default=1)
    current_step = Column(Integer, default=0)
    total_steps = Column(Integer, default=8)
    steps_completed = Column(JSONB, default=list)
    incorrect_actions = Column(Integer, default=0)
    time_taken = Column(Float, default=0.0)
    is_completed = Column(Boolean, default=False)
    final_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))

class RansomwareStep(Base):
    __tablename__ = "ransomware_steps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    simulation_id = Column(UUID(as_uuid=True), ForeignKey('ransomware_simulations.id', ondelete='CASCADE'), nullable=False)
    step_number = Column(Integer, nullable=False)
    action_taken = Column(String(100), nullable=False)
    is_correct = Column(Boolean, nullable=False)
    time_taken = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())