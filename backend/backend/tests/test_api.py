from fastapi.testclient import TestClient
from main import app
from models import GameMode

client = TestClient(app)

def test_read_main():
    # No root route defined, but docs should exist
    response = client.get("/docs")
    assert response.status_code == 200

def test_signup():
    response = client.post(
        "/auth/signup",
        json={"username": "testuser", "email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["email"] == "test@example.com"
    assert "token" in data

def test_login():
    # Create user first
    client.post(
        "/auth/signup",
        json={"username": "loginuser", "email": "login@example.com", "password": "password123"}
    )
    
    # Login
    response = client.post(
        "/auth/login",
        json={"email": "login@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    # Verify we got a JWT token (starts with eyJ)
    assert data["token"].startswith("eyJ")
    assert len(data["token"]) > 50  # JWT tokens are long

def test_get_me():
    # Create user and get real token
    signup_response = client.post(
        "/auth/signup",
        json={"username": "meuser", "email": "me@example.com", "password": "password123"}
    )
    token = signup_response.json()["token"]
    
    # Use real token
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == "meuser"

def test_leaderboard():
    response = client.get("/leaderboard")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_submit_score():
    # Create user and get real token
    signup_response = client.post(
        "/auth/signup",
        json={"username": "scorer", "email": "scorer@example.com", "password": "password123"}
    )
    token = signup_response.json()["token"]
    
    # Submit score with real token
    response = client.post(
        "/leaderboard",
        json={"score": 100, "mode": GameMode.WALLS},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["score"] == 100
    assert data["mode"] == "walls"

def test_live_players():
    response = client.get("/live-players")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
