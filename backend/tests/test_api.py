import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.database import Base, get_db
from main import app
from models.user import User
from models.training import TrainingScenario, UserProgress

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def auth_headers(client):
    # Register and login user
    user_data = {"email": "test@example.com", "password": "TestPass123!"}
    response = client.post("/api/auth/register", json=user_data)
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def admin_headers(client):
    # Create admin user
    db = TestingSessionLocal()
    admin_user = User(
        email="admin@example.com",
        password_hash="$argon2id$v=19$m=65536,t=3,p=4$test",
        is_admin=True
    )
    db.add(admin_user)
    db.commit()
    db.close()
    
    # Login admin
    response = client.post("/api/auth/login", json={
        "email": "admin@example.com", 
        "password": "TestPass123!"
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

class TestTrainingAPI:
    def test_get_scenarios_by_category(self, client, auth_headers):
        response = client.get("/api/training/scenarios/physical", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_start_scenario_unauthorized(self, client):
        response = client.post("/api/training/scenario/start", json={"scenario_id": "test"})
        assert response.status_code == 401

    def test_compliance_quiz_questions(self, client, auth_headers):
        response = client.get("/api/training/compliance/questions/gdpr", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "questions" in data
        # Ensure correct answers are not exposed
        for question in data["questions"]:
            assert "correct" not in question

class TestPhishingAPI:
    def test_generate_phishing_email(self, client, auth_headers):
        response = client.post("/api/phishing/generate", 
                             json={"difficulty": "beginner"}, 
                             headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "subject" in data
        assert "sender" in data

    def test_get_inbox(self, client, auth_headers):
        response = client.get("/api/phishing/inbox", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

class TestSimulationAPI:
    def test_generate_malicious_url(self, client, auth_headers):
        response = client.post("/api/simulation/url/generate",
                             json={"url_type": "phishing"},
                             headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "shortened_url" in data
        assert "qr_code" in data

    def test_password_check(self, client, auth_headers):
        response = client.post("/api/simulation/password/check",
                             json={"password": "TestPass123!"},
                             headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "strength_score" in data
        assert "feedback" in data

class TestAdminAPI:
    def test_admin_analytics_unauthorized(self, client, auth_headers):
        response = client.get("/api/admin/analytics/overview", headers=auth_headers)
        assert response.status_code == 403

    def test_admin_analytics_authorized(self, client, admin_headers):
        response = client.get("/api/admin/analytics/overview", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "user_performance" in data
        assert "attack_success" in data
        assert "risk_scoring" in data

    def test_user_management(self, client, admin_headers):
        response = client.get("/api/admin/users/management", headers=admin_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

class TestSecurityHeaders:
    def test_security_headers_present(self, client):
        response = client.get("/api/threats")
        assert "Content-Security-Policy" in response.headers
        assert "X-Content-Type-Options" in response.headers
        assert "X-Frame-Options" in response.headers
        assert "X-XSS-Protection" in response.headers

    def test_cors_headers(self, client):
        response = client.options("/api/auth/login")
        assert response.status_code == 200