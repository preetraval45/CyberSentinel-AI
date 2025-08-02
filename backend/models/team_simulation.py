from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from config.database import Base
import uuid

class TeamEnvironment(Base):
    __tablename__ = "team_environments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    platform = Column(String(20), nullable=False)  # 'slack', 'teams'
    team_name = Column(String(100), nullable=False)
    colleagues = Column(JSONB, default=list)
    channels = Column(JSONB, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SocialAttackMessage(Base):
    __tablename__ = "social_attack_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    environment_id = Column(UUID(as_uuid=True), ForeignKey('team_environments.id', ondelete='CASCADE'), nullable=False)
    sender_name = Column(String(100), nullable=False)
    sender_role = Column(String(50), nullable=False)
    channel = Column(String(50), nullable=False)
    message_content = Column(Text, nullable=False)
    attack_type = Column(String(50), nullable=False)  # 'credential_harvest', 'malware_link', 'urgent_request'
    is_clicked = Column(Boolean, default=False)
    is_reported = Column(Boolean, default=False)
    user_response = Column(Text)
    clicked_at = Column(DateTime(timezone=True))
    reported_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())