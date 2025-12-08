# Backend - Snake Showdown Live

This directory contains the FastAPI backend for the Snake Showdown Live game.

## Prerequisites

*   **uv**: Ensure you have `uv` installed for python dependency management.
*   **make** (optional): For using the Makefile commands.
*   **PostgreSQL** (optional): For production use. SQLite is used by default for development.

## Setup

1.  Navigate into the backend directory:
    ```bash
    cd backend/backend
    ```

2.  Install dependencies:
    ```bash
    uv sync
    # or
    make install
    ```

3.  Set up the database:
    ```bash
    # Initialize database tables
    make db-init
    
    # Seed with initial data
    make db-seed
    
    # Or do both at once (reset database)
    make db-reset
    ```

4.  (Optional) Configure environment variables:
    ```bash
    cp .env.example .env
    # Edit .env to set DATABASE_URL for PostgreSQL or SECRET_KEY
    ```

## Running the Server

### Using Makefile (recommended):
```bash
make dev
```

### Using uv directly:
```bash
uv run uvicorn main:app --reload
```

The server will be available at `http://localhost:8000`.
You can access the automatic API documentation at `http://localhost:8000/docs`.

## Running Tests

### Using Makefile:
```bash
make test           # Run tests
make test-verbose   # Run tests with verbose output
make test-coverage  # Run tests with coverage report
```

### Using uv directly:
```bash
uv run pytest
```

## Development Commands

The Makefile provides several useful commands:

*   `make help` - Show all available commands
*   `make install` - Install dependencies
*   `make dev` - Run development server
*   `make test` - Run tests
*   `make lint` - Run code linter (ruff)
*   `make format` - Format code (ruff)
*   `make clean` - Remove cache and build files

## Project Structure

*   `main.py`: Entry point for the FastAPI application. Includes all API route definitions.
*   `models.py`: Pydantic data models matching the OpenAPI specification.
*   `db.py`: In-memory mock database implementation.
*   `tests/`: Integration tests for the API.
