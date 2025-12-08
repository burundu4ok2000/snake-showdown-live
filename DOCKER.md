# Docker Deployment Guide

Complete guide for running Snake Showdown Live with Docker Compose.

## Prerequisites

- **Docker** (20.10+)
- **Docker Compose** (2.0+)

## Quick Start

### 1. Clone and navigate to project
```bash
cd /workspaces/snake-showdown-live
```

### 2. Set environment variables (optional)
```bash
cp .env.docker .env
# Edit .env to set SECRET_KEY and database credentials
```

### 3. Build and run all services
```bash
docker-compose up --build
```

The application will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432

## Architecture

```
┌─────────────────┐
│   Frontend      │
│  (React+Nginx)  │
│   Port: 80      │
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│    Backend      │
│   (FastAPI)     │
│   Port: 8000    │
└────────┬────────┘
         │
         │ SQL
         ▼
┌─────────────────┐
│   Database      │
│  (PostgreSQL)   │
│   Port: 5432    │
└─────────────────┘
```

## Services

### 🗄️ Database (PostgreSQL)
- **Image**: `postgres:16-alpine`
- **Port**: 5432
- **Database**: `snake_showdown`
- **User**: `snake_user`
- **Volume**: Persisted in `postgres_data`

### 🔧 Backend (FastAPI)
- **Build**: `./backend/backend`
- **Port**: 8000
- **Features**:
  - Automatic database migrations
  - Auto-seeding with test data
  - Hot reload in development

### 🌐 Frontend (React + Nginx)
- **Build**: Multi-stage (Node.js → Nginx)
- **Port**: 80
- **Features**:
  - Production-optimized build
  - Gzip compression
  - SPA routing support
  - Security headers

## Docker Commands

### Start services
```bash
docker-compose up
```

### Start in background (detached)
```bash
docker-compose up -d
```

### Rebuild and start
```bash
docker-compose up --build
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (⚠️ deletes database!)
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Run commands in containers
```bash
# Backend shell
docker-compose exec backend sh

# PostgreSQL CLI
docker-compose exec db psql -U snake_user -d snake_showdown

# Run backend tests
docker-compose exec backend uv run pytest
```

## Development Workflow

### Local development (without Docker)
```bash
# Terminal 1: Backend
cd backend/backend
make dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

### Docker development with hot reload
```bash
docker-compose up
# Changes to backend code will auto-reload
# Frontend requires rebuild: docker-compose up --build frontend
```

## Database Management

### Access PostgreSQL
```bash
docker-compose exec db psql -U snake_user -d snake_showdown
```

### View tables
```sql
\dt
```

### Query data
```sql
SELECT * FROM users;
SELECT * FROM leaderboard ORDER BY score DESC;
SELECT * FROM live_players;
```

### Reset database
```bash
docker-compose down -v
docker-compose up --build
```

### Backup database
```bash
docker-compose exec db pg_dump -U snake_user snake_showdown > backup.sql
```

### Restore database
```bash
cat backup.sql | docker-compose exec -T db psql -U snake_user snake_showdown
```

## Environment Variables

Create a `.env` file in the project root:

```env
SECRET_KEY=your-super-secret-jwt-key-change-this
POSTGRES_DB=snake_showdown
POSTGRES_USER=snake_user
POSTGRES_PASSWORD=secure_password_here
```

**⚠️ Security Note**: Never commit `.env` files to git! Use `.env.docker` as a template.

## Production Deployment

### Security Checklist
- [ ] Change `SECRET_KEY` to a long random string
- [ ] Update database credentials
- [ ] Update CORS origins in `backend/main.py`
- [ ] Use HTTPS (add reverse proxy like Traefik/Caddy)
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Add health checks
- [ ] Set resource limits

### Example production docker-compose.yml additions
```yaml
services:
  backend:
    restart: always
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
  
  frontend:
    restart: always
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

## Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :8000  # or :80, :5432

# Stop conflicting services or change ports in docker-compose.yml
```

### Database connection errors
```bash
# Check database is healthy
docker-compose ps

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Frontend can't connect to backend
- Check `VITE_API_URL` in frontend Dockerfile
- Ensure backend is running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`

### Rebuild after code changes
```bash
# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Rebuild all
docker-compose build
```

## Volumes

- **`postgres_data`**: Persistent PostgreSQL data
  - Location: Docker managed volume
  - Survives container restarts

To inspect volumes:
```bash
docker volume ls
docker volume inspect snake-showdown-live_postgres_data
```

## Test Credentials

After seeding, you can login with:
- Email: `pro@snake.com`, Password: `pass123`
- Email: `king@snake.com`, Password: `pass123`

## Performance Optimization

### Build optimization
```bash
# Use BuildKit for faster builds
DOCKER_BUILDKIT=1 docker-compose build
```

### Multi-stage builds
Already implemented for frontend (Node.js → Nginx)

### Caching
Docker layers are cached. Order Dockerfile commands from least to most frequently changing.

## Monitoring

### Container stats
```bash
docker stats
```

### Health checks
```bash
docker-compose ps
```

## Next Steps

1. **Set up CI/CD**: GitHub Actions, GitLab CI
2. **Add monitoring**: Prometheus + Grafana
3. **Set up logging**: ELK stack or Loki
4. **Configure CDN**: For static assets
5. **Add Redis**: For caching/sessions
6. **Set up backups**: Automated database backups

## Support

For issues, check:
1. Container logs: `docker-compose logs`
2. Container status: `docker-compose ps`
3. Network connectivity: `docker network inspect snake-showdown-live_snake-network`
