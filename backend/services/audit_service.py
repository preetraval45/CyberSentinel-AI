from sqlalchemy.orm import Session
from models.audit_log import AuditLog
from fastapi import Request
import json

class AuditService:
    @staticmethod
    def log_action(
        db: Session,
        user_id: int,
        action: str,
        resource: str,
        resource_id: str = None,
        details: dict = None,
        request: Request = None
    ):
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            resource=resource,
            resource_id=resource_id,
            details=json.dumps(details) if details else None,
            ip_address=request.client.host if request else None,
            user_agent=request.headers.get("user-agent") if request else None
        )
        db.add(audit_log)
        db.commit()
        return audit_log

    @staticmethod
    def get_audit_logs(db: Session, skip: int = 0, limit: int = 100):
        return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()

audit_service = AuditService()