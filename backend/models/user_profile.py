from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from config.database import Base
import uuid

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    job_role = Column(String(100))
    department = Column(String(100))
    company_size = Column(String(20))
    industry = Column(String(100))
    location = Column(String(100))
    language_preference = Column(String(10), default='en')
    communication_style = Column(String(20))  # 'formal', 'casual', 'technical'
    vulnerability_patterns = Column(JSONB, default=list)
    response_history = Column(JSONB, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())