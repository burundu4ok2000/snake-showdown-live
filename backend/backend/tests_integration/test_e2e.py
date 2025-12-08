"""
End-to-end integration tests for complete user flows.
"""
import pytest
from fastapi import status

def test_complete_user_journey(client):
    """Test complete user journey: signup -> login -> submit score -> view leaderboard."""
    
    # Step 1: Signup
    signup_response = client.post(
        "/auth/signup",
        json={
            "username": "journeyuser",
            "email": "journey@example.com",
            "password": "password123"
        }
    )
    assert signup_response.status_code == status.HTTP_201_CREATED
    token = signup_response.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Step 2: Get user profile
    profile_response = client.get("/auth/me", headers=headers)
    assert profile_response.status_code == status.HTTP_200_OK
    assert profile_response.json()["email"] == "journey@example.com"
    
    # Step 3: Submit a score
    score_response = client.post(
        "/leaderboard",
        headers=headers,
        json={"score": 3000, "mode": "walls"}
    )
    assert score_response.status_code == status.HTTP_201_CREATED
    assert score_response.json()["score"] == 3000
    
    # Step 4: View leaderboard
    leaderboard_response = client.get("/leaderboard")
    assert leaderboard_response.status_code == status.HTTP_200_OK
    leaderboard = leaderboard_response.json()
    assert len(leaderboard) == 1
    assert leaderboard[0]["username"] == "journeyuser"
    assert leaderboard[0]["score"] == 3000

def test_login_after_signup(client):
    """Test that user can login after signup."""
    # Signup
    client.post(
        "/auth/signup",
        json={
            "username": "logintest",
            "email": "logintest@example.com",
            "password": "testpass123"
        }
    )
    
    # Login with same credentials
    login_response = client.post(
        "/auth/login",
        json={
            "email": "logintest@example.com",
            "password": "testpass123"
        }
    )
    assert login_response.status_code == status.HTTP_200_OK
    assert "token" in login_response.json()

def test_multiple_users_leaderboard(client):
    """Test leaderboard with multiple users and scores."""
    users = [
        ("user1", "user1@test.com", 1000),
        ("user2", "user2@test.com", 2000),
        ("user3", "user3@test.com", 1500),
    ]
    
    for username, email, score in users:
        # Signup
        signup_response = client.post(
            "/auth/signup",
            json={
                "username": username,
                "email": email,
                "password": "password123"
            }
        )
        token = signup_response.json()["token"]
        
        # Submit score
        client.post(
            "/leaderboard",
            headers={"Authorization": f"Bearer {token}"},
            json={"score": score, "mode": "walls"}
        )
    
    # Check leaderboard order
    response = client.get("/leaderboard")
    leaderboard = response.json()
    
    assert len(leaderboard) == 3
    # Should be sorted by score descending
    assert leaderboard[0]["score"] == 2000
    assert leaderboard[0]["username"] == "user2"
    assert leaderboard[1]["score"] == 1500
    assert leaderboard[2]["score"] == 1000

def test_user_cannot_access_with_invalid_token(client, test_user):
    """Test that invalid token is rejected."""
    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer invalid-token-here"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
