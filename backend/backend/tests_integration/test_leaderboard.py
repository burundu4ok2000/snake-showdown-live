"""
Integration tests for leaderboard endpoints.
"""
import pytest
from fastapi import status
from models import GameMode
import crud

def test_get_empty_leaderboard(client):
    """Test getting empty leaderboard."""
    response = client.get("/leaderboard")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == []

def test_get_leaderboard_with_entries(client, db_session):
    """Test getting leaderboard with entries."""
    # Create some test entries
    crud.create_leaderboard_entry(db_session, 1, "Player1", 1000, GameMode.WALLS)
    crud.create_leaderboard_entry(db_session, 2, "Player2", 1500, GameMode.PASS_THROUGH)
    crud.create_leaderboard_entry(db_session, 3, "Player3", 800, GameMode.WALLS)
    
    response = client.get("/leaderboard")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 3
    # Should be sorted by score descending
    assert data[0]["score"] == 1500
    assert data[1]["score"] == 1000
    assert data[2]["score"] == 800

def test_get_leaderboard_filter_by_mode(client, db_session):
    """Test filtering leaderboard by game mode."""
    crud.create_leaderboard_entry(db_session, 1, "Player1", 1000, GameMode.WALLS)
    crud.create_leaderboard_entry(db_session, 2, "Player2", 1500, GameMode.PASS_THROUGH)
    crud.create_leaderboard_entry(db_session, 3, "Player3", 800, GameMode.WALLS)
    
    response = client.get("/leaderboard?mode=walls")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 2
    assert all(entry["mode"] == "walls" for entry in data)

def test_submit_score_authenticated(client, auth_headers, db_session):
    """Test submitting a score when authenticated."""
    response = client.post(
        "/leaderboard",
        headers=auth_headers,
        json={"score": 2500, "mode": "walls"}
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["score"] == 2500
    assert data["mode"] == "walls"
    assert data["username"] == "testuser"
    assert "date" in data

def test_submit_score_unauthenticated(client):
    """Test submitting a score without authentication fails."""
    response = client.post(
        "/leaderboard",
        json={"score": 1000, "mode": "walls"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_submit_multiple_scores(client, auth_headers):
    """Test submitting multiple scores from same user."""
    # Submit first score
    response1 = client.post(
        "/leaderboard",
        headers=auth_headers,
        json={"score": 1000, "mode": "walls"}
    )
    assert response1.status_code == status.HTTP_201_CREATED
    
    # Submit second score
    response2 = client.post(
        "/leaderboard",
        headers=auth_headers,
        json={"score": 1500, "mode": "pass-through"}
    )
    assert response2.status_code == status.HTTP_201_CREATED
    
    # Get leaderboard
    response3 = client.get("/leaderboard")
    data = response3.json()
    assert len(data) == 2
