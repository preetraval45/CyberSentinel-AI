from sqlalchemy import Column, String, DateTime, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from config.database import Base
import uuid

class ComplianceAudit(Base):
    __tablename__ = "compliance_audits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    audit_type = Column(String(100), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=True)
    details = Column(JSON)  # JSON object with audit details
    passed = Column(Boolean, default=False)
    audited_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
