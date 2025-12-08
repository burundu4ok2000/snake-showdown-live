# Integration Tests

This directory contains integration tests for the Snake Showdown Live backend API.

## Overview

Integration tests verify the complete functionality of the API with a real database (SQLite in test mode). Each test:

- Uses a **fresh test database** (created and destroyed for each test)
- Tests **actual HTTP endpoints** via TestClient
- Validates **end-to-end workflows** (signup → login → submit score, etc.)
- Ensures **database operations** work correctly

## Test Structure

```
tests_integration/
├── conftest.py              # Pytest configuration and fixtures
├── test_auth.py             # Authentication tests (signup, login, logout)
├── test_leaderboard.py      # Leaderboard CRUD operations
├── test_live_players.py     # Live players endpoints
└── test_e2e.py              # End-to-end user journey tests
```

## Running Tests

### Run only integration tests:
```bash
make test-integration
```

### Run all tests (unit + integration):
```bash
make test-all
```

### Run with verbose output:
```bash
uv run pytest -vv tests_integration/
```

### Run specific test file:
```bash
uv run pytest tests_integration/test_auth.py -v
```

### Run specific test:
```bash
uv run pytest tests_integration/test_auth.py::test_signup_success -v
```

## Test Coverage

### Authentication (`test_auth.py`)
- ✅ User signup (success & duplicate email)
- ✅ User login (success & wrong password)
- ✅ Get current user (authenticated & unauthorized)
- ✅ Logout

### Leaderboard (`test_leaderboard.py`)
- ✅ Get empty leaderboard
- ✅ Get leaderboard with entries (sorted by score)
- ✅ Filter leaderboard by game mode
- ✅ Submit score (authenticated & unauthenticated)
- ✅ Submit multiple scores

### Live Players (`test_live_players.py`)
- ✅ Get empty live players
- ✅ Get live players with data
- ✅ Get specific player by ID
- ✅ Handle non-existent player (404)
- ✅ Validate data structure

### End-to-End (`test_e2e.py`)
- ✅ Complete user journey (signup → login → submit score → view leaderboard)
- ✅ Login after signup
- ✅ Multiple users competing on leaderboard
- ✅ Invalid token rejection

## Test Database

Tests use a **separate SQLite database** (`test_db.db`) that is:
- Created fresh for each test
- Automatically cleaned up after each test
- Isolated from the main database (`snake_showdown.db`)

This ensures:
- No pollution of development data
- Parallel test execution safety
- Reproducible test results

## Fixtures

Key pytest fixtures available:

- **`db_session`**: Fresh database session for each test
- **`client`**: FastAPI TestClient with overridden DB dependency
- **`test_user`**: Pre-created test user
- **`auth_headers`**: Authentication headers for authenticated requests

## Example Test

```python
def test_complete_user_journey(client):
    # Signup
    response = client.post("/auth/signup", json={...})
    token = response.json()["token"]
    
    # Submit score
    client.post("/leaderboard", 
        headers={"Authorization": f"Bearer {token}"},
        json={"score": 3000, "mode": "walls"}
    )
    
    # View leaderboard
    response = client.get("/leaderboard")
    assert response.json()[0]["score"] == 3000
```

## Current Status

✅ **23 tests passing**  
⚠️ **44 warnings** (deprecation warnings from SQLAlchemy, safe to ignore)
