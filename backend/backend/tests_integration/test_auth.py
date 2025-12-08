"""
Integration tests for authentication endpoints.
"""
import pytest
from fastapi import status

def test_signup_success(client):
    """Test successful user registration."""
    response = client.post(
        "/auth/signup",
        json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["user"]["email"] == "newuser@example.com"
    assert data["user"]["username"] == "newuser"
    assert "token" in data
    assert len(data["token"]) > 0

def test_signup_duplicate_email(client, test_user):
    """Test signup with existing email fails."""
    response = client.post(
        "/auth/signup",
        json={
            "username": "another",
            "email": "test@example.com",  # Already exists
            "password": "password123"
        }
    )
    assert response.status_code == status.HTTP_409_CONFLICT

def test_login_success(client, test_user):
    """Test successful login."""
    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "testpass123"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["user"]["email"] == "test@example.com"
    assert "token" in data

def test_login_wrong_password(client, test_user):
    """Test login with wrong password fails."""
    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_login_nonexistent_user(client):
    """Test login with non-existent user fails."""
    response = client.post(
        "/auth/login",
        json={
            "email": "nobody@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_get_current_user(client, auth_headers):
    """Test getting current user profile."""
    response = client.get("/auth/me", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"

def test_get_current_user_unauthorized(client):
    """Test getting current user without authentication fails."""
    response = client.get("/auth/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_logout(client, auth_headers):
    """Test logout."""
    response = client.post("/auth/logout", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
