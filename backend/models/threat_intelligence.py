from sqlalchemy import Column, String, Text, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from config.database import Base
import uuid

class ThreatIntel(Base):
    __tablename__ = "threat_intelligence"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    threat_name = Column(String(255), nullable=False)
    description = Column(Text)
    indicators = Column(JSON)  # JSON array of indicators of compromise
    severity = Column(String(50))
    reported_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
