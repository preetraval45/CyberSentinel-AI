from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, threats, ai, vulnerabilities

app = FastAPI(title="CyberSentinel AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(threats.router, prefix="/api/threats", tags=["threats"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(vulnerabilities.router, prefix="/api/vulnerabilities", tags=["vulnerabilities"])

@app.get("/")
async def root():
    return {"message": "CyberSentinel AI API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}