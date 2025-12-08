#!/bin/bash
# Entrypoint script for combined container

set -e

echo "🚀 Starting Snake Showdown Live..."

# Wait for database
echo "⏳ Waiting for database..."
until pg_isready -h db -U snake_user -d snake_showdown; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Run migrations
echo "📊 Running database migrations..."
cd /app/backend
uv run python -c "from database import Base, engine; Base.metadata.create_all(bind=engine)"

# Seed database (only if empty)
echo "🌱 Seeding database..."
uv run python seed.py || echo "Database already seeded"

echo "✅ Setup complete!"

# Start supervisord (nginx + uvicorn)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
