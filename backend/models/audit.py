from sqlalchemy import Column, String, Text, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET
from sqlalchemy.sql import func
from config.database import Base
import uuid

class AuditLog(Base):
    __tablename__ = "logs"
    __table_args__ = {'schema': 'audit'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    action = Column(String(100), nullable=False)
    resource = Column(String(100))
    resource_id = Column(UUID(as_uuid=True))
    old_values = Column(JSONB)
    new_values = Column(JSONB)
    ip_address = Column(INET)
    user_agent = Column(Text)
    session_id = Column(String(255))
    severity = Column(String(20))
    status = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("severity IN ('low', 'medium', 'high', 'critical')"),
        CheckConstraint("status IN ('success', 'failure', 'warning')"),
        {'schema': 'audit'}
    )