import jwt
import requests
from typing import Dict, Optional
import os

class SSOService:
    @staticmethod
    def verify_google_token(token: str) -> Optional[Dict]:
        try:
            response = requests.get(f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={token}")
            if response.status_code == 200:
                return response.json()
        except:
            pass
        return None
    
    @staticmethod
    def verify_azure_token(token: str, tenant_id: str) -> Optional[Dict]:
        try:
            # Decode JWT without verification for demo
            decoded = jwt.decode(token, options={"verify_signature": False})
            if decoded.get("tid") == tenant_id:
                return decoded
        except:
            pass
        return None
    
    @staticmethod
    def verify_okta_token(token: str, domain: str) -> Optional[Dict]:
        try:
            response = requests.get(
                f"https://{domain}.okta.com/oauth2/v1/introspect",
                data={"token": token},
                headers={"Authorization": f"Basic {os.getenv('OKTA_CLIENT_CREDENTIALS')}"}
            )
            if response.status_code == 200:
                return response.json()
        except:
            pass
        return None
    
    @staticmethod
    def authenticate_sso(provider: str, token: str, config: Dict) -> Optional[Dict]:
        if provider == "google":
            return SSOService.verify_google_token(token)
        elif provider == "azure":
            return SSOService.verify_azure_token(token, config.get("tenant_id"))
        elif provider == "okta":
            return SSOService.verify_okta_token(token, config.get("domain"))
        return None