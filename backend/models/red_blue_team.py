from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from config.database import Base
import uuid

class Competition(Base):
    __tablename__ = "competitions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    status = Column(String(20), default='waiting')  # 'waiting', 'active', 'completed'
    current_round = Column(Integer, default=1)
    total_rounds = Column(Integer, default=3)
    round_duration = Column(Integer, default=300)  # seconds
    red_team_score = Column(Integer, default=0)
    blue_team_score = Column(Integer, default=0)
    round_end_time = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))

class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    competition_id = Column(UUID(as_uuid=True), ForeignKey('competitions.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    team = Column(String(10), nullable=False)  # 'red' or 'blue'
    role = Column(String(20), nullable=False)  # 'attacker', 'defender'
    score = Column(Integer, default=0)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

class RoundAction(Base):
    __tablename__ = "round_actions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    competition_id = Column(UUID(as_uuid=True), ForeignKey('competitions.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    round_number = Column(Integer, nullable=False)
    action_type = Column(String(50), nullable=False)  # 'attack', 'defense', 'countermeasure'
    target = Column(String(100))
    description = Column(Text, nullable=False)
    points_awarded = Column(Integer, default=0)
    is_successful = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())