from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, threats, ai, vulnerabilities, phishing, chat, simulation, training, admin, ai_workflow
from config.database import engine, Base
from middleware.security import SecurityHeadersMiddleware, InputSanitizationMiddleware, RateLimitMiddleware
import time

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CyberSentinel AI API", 
    version="1.0.0",
    docs_url=None,  # Disable docs in production
    redoc_url=None  # Disable redoc in production
)

# Security middleware (order matters)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(InputSanitizationMiddleware)
app.add_middleware(RateLimitMiddleware, calls=100, period=60)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://cybersentinel.local", "https://cybersentinel.ai"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(threats.router, prefix="/api/threats", tags=["threats"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(vulnerabilities.router, prefix="/api/vulnerabilities", tags=["vulnerabilities"])
app.include_router(phishing.router, prefix="/api/phishing", tags=["phishing"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(simulation.router, prefix="/api/simulation", tags=["simulation"])
app.include_router(training.router, prefix="/api/training", tags=["training"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(ai_workflow.router, prefix="/api/ai-workflow", tags=["ai-workflow"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": time.time()}

@app.get("/")
def root():
    return {"message": "CyberSentinel AI API", "version": "1.0.0"}