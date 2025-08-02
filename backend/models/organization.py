from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    domain = Column(String, nullable=False, unique=True)
    sso_provider = Column(String)  # google, azure, okta
    sso_config = Column(JSON)
    gdpr_enabled = Column(Boolean, default=False)
    hipaa_enabled = Column(Boolean, default=False)
    data_retention_days = Column(Integer, default=365)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True)
    org_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    action = Column(String, nullable=False)
    resource = Column(String, nullable=False)
    details = Column(JSON)
    ip_address = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class ComplianceExport(Base):
    __tablename__ = "compliance_exports"
    
    id = Column(Integer, primary_key=True)
    org_id = Column(Integer, nullable=False)
    export_type = Column(String, nullable=False)  # gdpr, hipaa, audit
    status = Column(String, default="pending")
    file_path = Column(String)
    requested_by = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)