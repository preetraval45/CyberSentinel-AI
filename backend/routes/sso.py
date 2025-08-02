from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from services.sso_service import SSOService
from services.compliance_service import ComplianceService

router = APIRouter(prefix="/api/sso", tags=["sso"])

class SSOLoginRequest(BaseModel):
    provider: str
    token: str
    domain: str

class ComplianceExportRequest(BaseModel):
    export_type: str  # gdpr, audit
    user_id: int = None

@router.post("/login")
async def sso_login(request: SSOLoginRequest, http_request: Request):
    try:
        # Get org config based on domain
        org_config = {"tenant_id": "example", "domain": request.domain}
        
        user_data = SSOService.authenticate_sso(request.provider, request.token, org_config)
        if not user_data:
            raise HTTPException(status_code=401, detail="Invalid SSO token")
        
        # Log audit event
        ComplianceService.log_audit_event(
            org_id=1,
            user_id=user_data.get("sub", "unknown"),
            action="sso_login",
            resource="auth",
            details={"provider": request.provider},
            ip=http_request.client.host
        )
        
        return {"success": True, "user": user_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/export")
async def export_compliance_data(request: ComplianceExportRequest):
    try:
        if request.export_type == "gdpr" and request.user_id:
            filepath = ComplianceService.export_gdpr_data(1, request.user_id)
        elif request.export_type == "audit":
            from datetime import datetime, timedelta
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=30)
            filepath = ComplianceService.export_audit_logs(1, start_date, end_date)
        else:
            raise HTTPException(status_code=400, detail="Invalid export type")
        
        return {"success": True, "file_path": filepath}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/compliance/{org_id}")
async def get_compliance_status(org_id: int):
    return ComplianceService.get_compliance_status(org_id)