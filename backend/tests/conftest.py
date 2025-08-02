import pytest
import os
import tempfile
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from config.database import Base, get_db
from main import app
from models.user import User
from utils.auth import get_password_hash

# Use in-memory SQLite for testing
@pytest.fixture(scope="session")
def engine():
    return create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})

@pytest.fixture(scope="session")
def tables(engine):
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)

@pytest.fixture
def db_session(engine, tables):
    """Returns an sqlalchemy session, and after the test tears down everything properly."""
    connection = engine.connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection)()

    yield session

    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db_session):
    """Create a test client that uses the override_get_db fixture to return a session."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(db_session):
    """Create a test user in the database."""
    user = User(
        email="test@example.com",
        password_hash=get_password_hash("TestPass123!"),
        role="user",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def admin_user(db_session):
    """Create an admin user in the database."""
    user = User(
        email="admin@example.com",
        password_hash=get_password_hash("AdminPass123!"),
        role="admin",
        is_admin=True,
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def auth_headers(client, test_user):
    """Get authentication headers for a regular user."""
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "TestPass123!"
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def admin_headers(client, admin_user):
    """Get authentication headers for an admin user."""
    response = client.post("/api/auth/login", json={
        "email": "admin@example.com",
        "password": "AdminPass123!"
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(autouse=True)
def env_setup(monkeypatch):
    """Set up environment variables for testing."""
    monkeypatch.setenv("JWT_SECRET", "test-secret-key")
    monkeypatch.setenv("JWT_REFRESH_SECRET", "test-refresh-secret-key")
    monkeypatch.setenv("DATABASE_URL", "sqlite:///:memory:")
    monkeypatch.setenv("ENVIRONMENT", "testing")