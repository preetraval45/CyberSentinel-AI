from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET
from sqlalchemy.sql import func
from config.database import Base
import uuid

class MaliciousURL(Base):
    __tablename__ = "malicious_urls"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    original_url = Column(String(500), nullable=False)
    shortened_url = Column(String(255), nullable=False)
    qr_code_path = Column(String(255))
    url_type = Column(String(50), nullable=False)  # phishing, malware, scam
    is_clicked = Column(Boolean, default=False)
    click_count = Column(Integer, default=0)
    user_input = Column(JSONB)  # Store any form data submitted
    ip_address = Column(INET)
    user_agent = Column(Text)
    clicked_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PasswordCheck(Base):
    __tablename__ = "password_checks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    password_hash = Column(String(64))  # SHA-1 hash for HIBP
    is_pwned = Column(Boolean, nullable=False)
    breach_count = Column(Integer, default=0)
    strength_score = Column(Integer)  # 0-100
    feedback = Column(JSONB)
    checked_at = Column(DateTime(timezone=True), server_default=func.now())