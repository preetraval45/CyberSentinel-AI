import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.database import Base, get_db
from main import app
from models.user import User
from utils.auth import get_password_hash, verify_password, validate_password_strength

# Test database
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
def test_user():
    return {
        "email": "test@example.com",
        "password": "TestPass123!"
    }

class TestPasswordSecurity:
    def test_password_strength_validation(self):
        # Valid password
        assert validate_password_strength("TestPass123!") == True
        
        # Invalid passwords
        assert validate_password_strength("weak") == False  # Too short
        assert validate_password_strength("testpass123!") == False  # No uppercase
        assert validate_password_strength("TESTPASS123!") == False  # No lowercase
        assert validate_password_strength("TestPass!") == False  # No number
        assert validate_password_strength("TestPass123") == False  # No special char

    def test_argon2_password_hashing(self):
        password = "TestPass123!"
        hashed = get_password_hash(password)
        
        # Should not be the same as original
        assert hashed != password
        
        # Should verify correctly
        assert verify_password(password, hashed) == True
        
        # Should not verify incorrect password
        assert verify_password("WrongPass123!", hashed) == False

class TestAuthentication:
    def test_register_user(self, client, test_user):
        response = client.post("/api/auth/register", json=test_user)
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_register_weak_password(self, client):
        response = client.post("/api/auth/register", json={
            "email": "test@example.com",
            "password": "weak"
        })
        assert response.status_code == 400

    def test_login_user(self, client, test_user):
        # Register first
        client.post("/api/auth/register", json=test_user)
        
        # Then login
        response = client.post("/api/auth/login", json=test_user)
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data

    def test_login_invalid_credentials(self, client, test_user):
        # Register first
        client.post("/api/auth/register", json=test_user)
        
        # Try login with wrong password
        response = client.post("/api/auth/login", json={
            "email": test_user["email"],
            "password": "WrongPass123!"
        })
        assert response.status_code == 401

    def test_refresh_token_rotation(self, client, test_user):
        # Register and get tokens
        register_response = client.post("/api/auth/register", json=test_user)
        tokens = register_response.json()
        
        # Use refresh token to get new access token
        response = client.post("/api/auth/refresh", json={
            "refresh_token": tokens["refresh_token"]
        })
        assert response.status_code == 200
        new_tokens = response.json()
        
        # Should get new tokens
        assert new_tokens["access_token"] != tokens["access_token"]
        assert new_tokens["refresh_token"] != tokens["refresh_token"]

    def test_protected_route_without_token(self, client):
        response = client.get("/api/admin/analytics/overview")
        assert response.status_code == 401

    def test_protected_route_with_invalid_token(self, client):
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/api/admin/analytics/overview", headers=headers)
        assert response.status_code == 401

class TestInputSanitization:
    def test_malicious_input_blocked(self, client):
        malicious_inputs = [
            "<script>alert('xss')</script>",
            "javascript:alert('xss')",
            "<iframe src='evil.com'></iframe>",
            "onload=alert('xss')"
        ]
        
        for malicious_input in malicious_inputs:
            response = client.get(f"/api/threats?search={malicious_input}")
            assert response.status_code == 400

    def test_sql_injection_prevention(self, client, test_user):
        # Register user first
        client.post("/api/auth/register", json=test_user)
        
        # Try SQL injection in login
        response = client.post("/api/auth/login", json={
            "email": "test@example.com'; DROP TABLE users; --",
            "password": "TestPass123!"
        })
        # Should not crash the application
        assert response.status_code in [400, 401, 422]