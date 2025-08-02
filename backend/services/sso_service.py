from authlib.integrations.fastapi_oauth2 import OAuth2Token
from authlib.integrations.httpx_oauth2 import OAuth2Client
import os
from typing import Dict, Any

class SSOService:
    def __init__(self):
        self.google_client = OAuth2Client(
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
            server_metadata_url="https://accounts.google.com/.well-known/openid_configuration"
        )
        
        self.azure_client = OAuth2Client(
            client_id=os.getenv("AZURE_CLIENT_ID"),
            client_secret=os.getenv("AZURE_CLIENT_SECRET"),
            server_metadata_url=f"https://login.microsoftonline.com/{os.getenv('AZURE_TENANT_ID')}/v2.0/.well-known/openid_configuration"
        )
        
        self.okta_client = OAuth2Client(
            client_id=os.getenv("OKTA_CLIENT_ID"),
            client_secret=os.getenv("OKTA_CLIENT_SECRET"),
            server_metadata_url=f"https://{os.getenv('OKTA_DOMAIN')}/.well-known/openid_configuration"
        )
    
    async def get_google_user_info(self, token: OAuth2Token) -> Dict[str, Any]:
        resp = await self.google_client.get("https://www.googleapis.com/oauth2/v2/userinfo", token=token)
        return resp.json()
    
    async def get_azure_user_info(self, token: OAuth2Token) -> Dict[str, Any]:
        resp = await self.azure_client.get("https://graph.microsoft.com/v1.0/me", token=token)
        return resp.json()
    
    async def get_okta_user_info(self, token: OAuth2Token) -> Dict[str, Any]:
        resp = await self.okta_client.get(f"https://{os.getenv('OKTA_DOMAIN')}/oauth2/v1/userinfo", token=token)
        return resp.json()

sso_service = SSOService()