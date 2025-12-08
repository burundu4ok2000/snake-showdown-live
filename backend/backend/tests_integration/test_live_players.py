"""
Integration tests for live players endpoints.
"""
import pytest
from fastapi import status
from models import GameMode
import crud

def test_get_empty_live_players(client):
    """Test getting empty live players list."""
    response = client.get("/live-players")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == []

def test_get_live_players_with_data(client, db_session):
    """Test getting live players."""
    # Create test live players
    crud.create_live_player(
        db_session,
        player_id="player-1",
        username="LivePlayer1",
        score=100,
        mode=GameMode.WALLS,
        snake=[{"x": 10, "y": 10}, {"x": 9, "y": 10}],
        food={"x": 15, "y": 15},
        direction="RIGHT",
        status="playing"
    )
    crud.create_live_player(
        db_session,
        player_id="player-2",
        username="LivePlayer2",
        score=200,
        mode=GameMode.PASS_THROUGH,
        snake=[{"x": 5, "y": 5}, {"x": 4, "y": 5}],
        food={"x": 10, "y": 10},
        direction="LEFT",
        status="playing"
    )
    
    response = client.get("/live-players")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 2
    assert data[0]["username"] == "LivePlayer1"
    assert data[1]["username"] == "LivePlayer2"

def test_get_live_player_by_id(client, db_session):
    """Test getting specific live player by ID."""
    crud.create_live_player(
        db_session,
        player_id="player-123",
        username="TestPlayer",
        score=500,
        mode=GameMode.WALLS,
        snake=[{"x": 10, "y": 10}],
        food={"x": 5, "y": 5},
        direction="UP",
        status="playing"
    )
    
    response = client.get("/live-players/player-123")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == "player-123"
    assert data["username"] == "TestPlayer"
    assert data["score"] == 500
    assert len(data["snake"]) == 1
    assert data["snake"][0] == {"x": 10, "y": 10}

def test_get_nonexistent_live_player(client):
    """Test getting non-existent player returns 404."""
    response = client.get("/live-players/nonexistent-id")
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_live_player_data_structure(client, db_session):
    """Test that live player has correct data structure."""
    crud.create_live_player(
        db_session,
        player_id="test-player",
        username="StructureTest",
        score=150,
        mode=GameMode.PASS_THROUGH,
        snake=[{"x": 1, "y": 2}, {"x": 1, "y": 1}],
        food={"x": 5, "y": 5},
        direction="DOWN",
        status="playing"
    )
    
    response = client.get("/live-players/test-player")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    # Check all required fields
    assert "id" in data
    assert "username" in data
    assert "score" in data
    assert "mode" in data
    assert "snake" in data
    assert "food" in data
    assert "direction" in data
    assert "status" in data
    
    # Check types
    assert isinstance(data["snake"], list)
    assert isinstance(data["food"], dict)
    assert data["mode"] in ["pass-through", "walls"]
