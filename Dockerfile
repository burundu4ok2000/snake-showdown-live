FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Python backend stage
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy backend files
COPY backend/backend/pyproject.toml ./backend/
WORKDIR /app/backend
RUN uv sync --no-dev

# Copy backend application
COPY backend/backend/ ./

# Copy frontend build from previous stage
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Copy nginx configuration
COPY deployment/nginx-combined.conf /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/sites-enabled/default && \
    ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Copy supervisord configuration
COPY deployment/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy and set entrypoint
COPY deployment/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port
EXPOSE 80

# Use entrypoint
ENTRYPOINT ["/entrypoint.sh"]
