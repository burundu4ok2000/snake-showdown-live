# Snake Showdown Live

A real-time multiplayer snake game with leaderboards and spectator mode.

## Architecture

This project consists of two main components:

*   **Frontend**: React + TypeScript + Vite application
*   **Backend**: FastAPI (Python) REST API

## Prerequisites

*   **Node.js** (for frontend)
*   **uv** (for backend Python dependency management)

## Quick Start

### Option 1: Docker Compose (Recommended for Production)

**Requires**: Docker & Docker Compose

```bash
# Start all services (PostgreSQL + Backend + Frontend)
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

Access the application:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

**📖 Full Docker guide**: See [DOCKER.md](./DOCKER.md)

### Option 2: Run Both Services Together (Development)

From the project root:

```bash
npm install
npm run dev
```

This will start both the backend and frontend simultaneously using `concurrently`.

### Option 3: Run Services Separately (Development)

**Backend:**
```bash
cd backend/backend
uv sync
uv run uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Accessing the Application

*   **Frontend**: `http://localhost:8080`
*   **Backend API**: `http://localhost:8000`
*   **API Documentation**: `http://localhost:8000/docs`

### 3. Test Credentials

You can use these pre-configured test accounts:

*   Email: `pro@snake.com`, Password: `pass123`
*   Email: `king@snake.com`, Password: `pass123`
*   Email: `slither@snake.com`, Password: `pass123`

Or sign up with a new account.

## Development

### Running Tests

**All tests:**
```bash
npm test
```

**Frontend only:**
```bash
cd frontend
npm test
```

**Backend only:**
```bash
cd backend/backend
uv run pytest
```

### Environment Configuration

The frontend uses environment variables to configure the API URL. Create a `.env` file in the `frontend` directory:

```
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
├── backend/
│   └── backend/
│       ├── main.py          # FastAPI application and routes
│       ├── models.py        # Pydantic data models
│       ├── db.py            # Mock database
│       ├── tests/           # Backend tests
│       └── pyproject.toml   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── lib/             # Utility functions and game logic
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── vite.config.ts
└── openapi.yaml             # API specification
```

## API Reference

See `openapi.yaml` for the complete API specification. The backend implements the following endpoints:

*   `POST /auth/login` - User authentication
*   `POST /auth/signup` - User registration
*   `POST /auth/logout` - Logout
*   `GET /auth/me` - Get current user
*   `GET /leaderboard` - Get leaderboard (filterable by mode)
*   `POST /leaderboard` - Submit score (requires auth)
*   `GET /live-players` - Get all active players
*   `GET /live-players/{id}` - Get specific player details

## Features

*   **Two Game Modes**: 
    *   Walls: Collision with walls or self ends the game
    *   Pass-through: Snake wraps around the edges
*   **Leaderboards**: Track high scores for each game mode
*   **Spectator Mode**: Watch other players in real-time
*   **Authentication**: Secure user accounts and session management

## Notes

*   The backend currently uses an in-memory mock database. Data is not persisted between server restarts.
*   Spectator mode simulates player movements client-side for demonstration purposes.
