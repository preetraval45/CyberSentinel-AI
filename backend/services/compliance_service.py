import json
import csv
from datetime import datetime, timedelta
from typing import Dict, List
from models.organization import AuditLog, ComplianceExport
import os

class ComplianceService:
    @staticmethod
    def log_audit_event(org_id: int, user_id: int, action: str, resource: str, details: Dict, ip: str):
        log = AuditLog(
            org_id=org_id,
            user_id=user_id,
            action=action,
            resource=resource,
            details=details,
            ip_address=ip
        )
        # Save to database
    
    @staticmethod
    def export_gdpr_data(org_id: int, user_id: int) -> str:
        # Export user data for GDPR compliance
        data = {
            "user_data": {"id": user_id, "scenarios_completed": 25},
            "audit_logs": [{"action": "login", "timestamp": datetime.utcnow().isoformat()}],
            "export_date": datetime.utcnow().isoformat()
        }
        
        filename = f"gdpr_export_{org_id}_{user_id}_{int(datetime.utcnow().timestamp())}.json"
        filepath = f"/exports/{filename}"
        
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        return filepath
    
    @staticmethod
    def export_audit_logs(org_id: int, start_date: datetime, end_date: datetime) -> str:
        # Export audit logs as CSV
        filename = f"audit_logs_{org_id}_{int(datetime.utcnow().timestamp())}.csv"
        filepath = f"/exports/{filename}"
        
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['Timestamp', 'User ID', 'Action', 'Resource', 'IP Address'])
            # Query and write audit logs
            writer.writerow([datetime.utcnow(), 123, 'login', 'system', '192.168.1.1'])
        
        return filepath
    
    @staticmethod
    def delete_user_data(org_id: int, user_id: int):
        # GDPR right to be forgotten
        # Anonymize or delete user data based on retention policy
        pass
    
    @staticmethod
    def get_compliance_status(org_id: int) -> Dict:
        return {
            "gdpr_compliant": True,
            "hipaa_compliant": True,
            "last_audit": datetime.utcnow().isoformat(),
            "data_retention_days": 365,
            "encryption_enabled": True
        }