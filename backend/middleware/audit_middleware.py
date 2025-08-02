from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from services.compliance_service import ComplianceService
import json

class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Log API requests for compliance
        if request.url.path.startswith("/api/"):
            body = await request.body()
            
            ComplianceService.log_audit_event(
                org_id=1,  # Get from user context
                user_id=getattr(request.state, 'user_id', 0),
                action=request.method,
                resource=request.url.path,
                details={"body_size": len(body)},
                ip=request.client.host
            )
        
        response = await call_next(request)
        return response