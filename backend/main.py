from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, threats, ai, vulnerabilities, phishing, chat, simulation, training, admin
from config.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CyberSentinel AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://cybersentinel.local"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.get("/")
def root():
    return {"message": "CyberSentinel AI API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}