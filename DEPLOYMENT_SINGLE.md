# Single Container Deployment Guide

This guide covers deploying Snake Showdown Live as a **single container** with both frontend and backend.

## Architecture

```
┌─────────────────────────────────────┐
│    Single Container (Port 80)      │
│                                     │
│  ┌──────────────────────────────┐  │
│  │         Nginx                │  │
│  │  - Serves static files       │  │
│  │  - Proxies /api to backend   │  │
│  └────────┬────────────┬────────┘  │
│           │            │            │
│    Static │            │ API Proxy  │
│    Files  │            │            │
│           ▼            ▼            │
│  ┌──────────┐   ┌──────────────┐  │
│  │ Frontend │   │   Backend    │  │
│  │  (dist)  │   │  (FastAPI)   │  │
│  │          │   │  Port 8000   │  │
│  └──────────┘   └──────────────┘  │
│                                     │
└─────────────────────────────────────┘
         │
         │ PostgreSQL Protocol
         ▼
┌─────────────────────────────────────┐
│      Database Container             │
│       PostgreSQL 16                 │
│        Port 5432                    │
└─────────────────────────────────────┘
```

## Quick Start

### Build and run
```bash
docker-compose -f docker-compose.single.yml up --build
```

### Access application
- **Application**: http://localhost
- **API Docs**: http://localhost/docs

## What's Inside the Container

### Nginx
- **Port**: 80 (external)
- **Serves**: Frontend static files from `/app/frontend/dist`
- **Proxies**: `/api/*` requests to backend (127.0.0.1:8000)
- **Config**: `/etc/nginx/sites-available/default`

### FastAPI Backend
- **Port**: 8000 (internal only)
- **Location**: `/app/backend`
- **Database**: PostgreSQL via network
- **Runs via**: uv + uvicorn

### Supervisord
- **Manages**: Both nginx and uvicorn processes
- **Config**: `/etc/supervisor/conf.d/supervisord.conf`
- **Logs**: `/var/log/supervisor/`

## API Routes

When using single container:
- `http://localhost/` → Frontend
- `http://localhost/api/auth/login` → Backend (proxied)
- `http://localhost/api/leaderboard` → Backend (proxied)
- `http://localhost/docs` → FastAPI docs (proxied)

Note: The `/api` prefix is automatically stripped when proxying to backend.

## Environment Variables

Create `.env` file:

```env
SECRET_KEY=your-super-secret-key
POSTGRES_DB=snake_showdown
POSTGRES_USER=snake_user
POSTGRES_PASSWORD=secure_password
```

## Development vs Production

### Development (Separate containers)
```bash
docker-compose up --build
```
- Frontend: Port 80
- Backend: Port 8000 (exposed)
- Database: Port 5432

### Production (Single container)
```bash
docker-compose -f docker-compose.single.yml up -d --build
```
- Application: Port 80 (nginx)
- Database: Port 5432
- Backend: Internal only (127.0.0.1:8000)

## Advantages of Single Container

✅ **Simpler deployment** - Only one application container  
✅ **Better security** - Backend not directly accessible  
✅ **Unified logs** - All app logs in one place  
✅ **Lower resource usage** - Fewer containers  
✅ **Easier scaling** - Scale app container as one unit  

## Disadvantages

❌ **Less flexibility** - Can't scale frontend/backend separately  
❌ **Longer rebuild** - Changes to either require full rebuild  
❌ **Larger image** - Contains both frontend and backend  

## Building for Production

### 1. Build the image
```bash
docker build -t snake-showdown:latest .
```

### 2. Run with database
```bash
docker-compose -f docker-compose.single.yml up -d
```

### 3. Check logs
```bash
docker-compose -f docker-compose.single.yml logs -f app
```

## Customization

### Change API prefix
Edit `deployment/nginx-combined.conf`:
```nginx
location /api/ {
    rewrite ^/api/(.*) /$1 break;
    proxy_pass http://127.0.0.1:8000;
}
```

### Add SSL/HTTPS
Use a reverse proxy like Traefik or Caddy in front, or update nginx config to include SSL certificates.

### Resource limits
Add to `docker-compose.single.yml`:
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## Monitoring

### View supervisord status
```bash
docker exec snake-app supervisorctl status
```

### View nginx logs
```bash
docker exec snake-app tail -f /var/log/supervisor/nginx.log
```

### View backend logs
```bash
docker exec snake-app tail -f /var/log/supervisor/backend.log
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs snake-app

# Check supervisord
docker exec snake-app supervisorctl status
```

### Backend not responding
```bash
# Restart backend process
docker exec snake-app supervisorctl restart backend

# Check backend logs
docker exec snake-app tail -f /var/log/supervisor/backend-error.log
```

### Nginx configuration errors
```bash
# Test nginx config
docker exec snake-app nginx -t

# Reload nginx
docker exec snake-app supervisorctl restart nginx
```

### Database connection issues
```bash
# Check database
docker-compose -f docker-compose.single.yml ps db

# Test connection from app container
docker exec snake-app pg_isready -h db -U snake_user
```

## Deployment to Cloud

### Docker Hub
```bash
# Build and tag
docker build -t yourusername/snake-showdown:latest .

# Push
docker push yourusername/snake-showdown:latest

# Pull and run on server
docker pull yourusername/snake-showdown:latest
docker-compose -f docker-compose.single.yml up -d
```

### AWS ECS / Google Cloud Run / Azure Container Instances
All support single-container deployments. Configure:
- Environment variables (DATABASE_URL, SECRET_KEY)
- Port mapping (80 → 80)
- Health checks (GET /)

### Heroku
```bash
# Use heroku.yml or Dockerfile deployment
heroku container:push web
heroku container:release web
```

## Health Checks

Add to Dockerfile:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
```

## CI/CD Example (GitHub Actions)

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t snake-showdown:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          docker tag snake-showdown:${{ github.sha }} registry.example.com/snake-showdown:latest
          docker push registry.example.com/snake-showdown:latest
```

## Performance Tips

1. **Use multi-stage builds** (already implemented)
2. **Enable nginx caching** for static assets
3. **Use gunicorn instead of uvicorn** for production:
   ```ini
   [program:backend]
   command=gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000
   ```
4. **Add Redis** for caching and sessions
5. **Enable gzip compression** (already enabled)

## Comparison with Multi-Container

| Feature | Single Container | Multi-Container |
|---------|------------------|-----------------|
| Complexity | Lower | Higher |
| Flexibility | Lower | Higher |
| Security | Better (backend hidden) | Good |
| Resource usage | Lower | Higher |
| Deployment speed | Faster | Slower |
| Independent scaling | No | Yes |
| Development | Less flexible | More flexible |

## When to Use Single Container

✅ **Small to medium applications**  
✅ **Simple deployment requirements**  
✅ **Cost-sensitive deployments**  
✅ **Serverless platforms** (Cloud Run, etc.)  

## When to Use Multi-Container

✅ **Large applications**  
✅ **Need to scale frontend/backend independently**  
✅ **Microservices architecture**  
✅ **Different update frequencies** for frontend/backend  

## Next Steps

1. Test the single-container build
2. Configure environment variables
3. Set up CI/CD pipeline
4. Deploy to your cloud provider
5. Set up monitoring and logging
6. Configure backups for database
