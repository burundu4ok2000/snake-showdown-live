.PHONY: help install dev test test-integration test-all clean lint format db-init db-seed db-reset

help:
	@echo "Available commands:"
	@echo "  make install           - Install dependencies"
	@echo "  make dev               - Run development server"
	@echo "  make test              - Run unit tests"
	@echo "  make test-integration  - Run integration tests"
	@echo "  make test-all          - Run all tests"
	@echo "  make clean             - Remove cache and build files"
	@echo "  make lint              - Run linter (ruff)"
	@echo "  make format            - Format code (ruff)"
	@echo "  make db-init           - Initialize database tables"
	@echo "  make db-seed           - Seed database with initial data"
	@echo "  make db-reset          - Reset database (drop and recreate)"

install:
	uv sync

dev:
	uv run uvicorn main:app --reload

test:
	uv run pytest -v tests/

test-integration:
	uv run pytest -v tests_integration/

test-all:
	uv run pytest -v

test-verbose:
	uv run pytest -vv

test-coverage:
	uv run pytest --cov=. --cov-report=html --cov-report=term

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true

lint:
	uv run ruff check .

format:
	uv run ruff format .

db-init:
	uv run python -c "from database import Base, engine; Base.metadata.create_all(bind=engine); print('✅ Database initialized')"

db-seed:
	uv run python seed.py

db-reset:
	rm -f snake_showdown.db
	@echo "Database file removed"
	$(MAKE) db-init
	$(MAKE) db-seed
