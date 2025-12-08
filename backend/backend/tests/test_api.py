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
    # Helper to ensure user exists
    client.post(
        "/auth/signup",
        json={"username": "loginuser", "email": "login@example.com", "password": "password123"}
    )
    
    response = client.post(
        "/auth/login",
        json={"email": "login@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["token"] == "mock-jwt-token"

def test_get_me():
    # Use the mock token
    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer mock-jwt-token"}
    )
    assert response.status_code == 200
    assert "username" in response.json()

def test_leaderboard():
    response = client.get("/leaderboard")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_submit_score():
    response = client.post(
        "/leaderboard",
        json={"score": 100, "mode": GameMode.WALLS},
        headers={"Authorization": "Bearer mock-jwt-token"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["score"] == 100
    assert data["mode"] == "walls"

def test_live_players():
    response = client.get("/live-players")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
