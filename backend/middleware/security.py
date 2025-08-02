from fastapi import Request, HTTPException, status
from fastapi.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware
import re
import time
from typing import List

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Content Security Policy
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self'; "
            "connect-src 'self'; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self'"
        )
        
        # Security headers
        response.headers["Content-Security-Policy"] = csp
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # HTTPS enforcement
        if request.url.scheme == "http" and not request.url.hostname in ["localhost", "127.0.0.1"]:
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response

class InputSanitizationMiddleware(BaseHTTPMiddleware):
    DANGEROUS_PATTERNS = [
        r'<script[^>]*>.*?</script>',
        r'javascript:',
        r'on\w+\s*=',
        r'<iframe[^>]*>.*?</iframe>',
        r'<object[^>]*>.*?</object>',
        r'<embed[^>]*>.*?</embed>',
    ]
    
    async def dispatch(self, request: Request, call_next):
        # Check for dangerous patterns in URL
        url_str = str(request.url)
        for pattern in self.DANGEROUS_PATTERNS:
            if re.search(pattern, url_str, re.IGNORECASE):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Potentially malicious input detected"
                )
        
        # Check request headers for suspicious content
        for header_name, header_value in request.headers.items():
            if isinstance(header_value, str):
                for pattern in self.DANGEROUS_PATTERNS:
                    if re.search(pattern, header_value, re.IGNORECASE):
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Potentially malicious header detected"
                        )
        
        return await call_next(request)

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, calls: int = 100, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.clients = {}
    
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        if client_ip not in self.clients:
            self.clients[client_ip] = []
        
        # Clean old requests
        self.clients[client_ip] = [
            req_time for req_time in self.clients[client_ip]
            if current_time - req_time < self.period
        ]
        
        # Check rate limit
        if len(self.clients[client_ip]) >= self.calls:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded"
            )
        
        self.clients[client_ip].append(current_time)
        return await call_next(request)