#!/bin/bash
# Entrypoint script for combined container

set -e

echo "🚀 Starting Snake Showdown Live..."

# Set default PORT if not provided (for local Docker)
export PORT=${PORT:-80}

# Substitute PORT in nginx config
echo "📝 Configuring nginx to listen on port $PORT..."
envsubst '${PORT}' < /etc/nginx/sites-available/default > /tmp/nginx.conf
mv /tmp/nginx.conf /etc/nginx/sites-available/default

# Wait for database (extract host from DATABASE_URL if provided)
if [ -n "$DATABASE_URL" ]; then
    # For Render/cloud deployments with DATABASE_URL
    echo "⏳ Waiting for database (from DATABASE_URL)..."
    
    # Extract host from DATABASE_URL (postgresql://user:pass@HOST:PORT/dbname)
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\).*/\1/p')
    
    # Wait for database to be ready
    echo "Connecting to database host: $DB_HOST"
    until pg_isready -h "$DB_HOST" -U postgres 2>/dev/null; do
        echo "Database is unavailable - sleeping"
        sleep 2
    done
else
    # For local Docker Compose with 'db' service name
    echo "⏳ Waiting for database..."
    until pg_isready -h db -U snake_user -d snake_showdown 2>/dev/null; do
        echo "Database is unavailable - sleeping"
        sleep 2
    done
fi

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
