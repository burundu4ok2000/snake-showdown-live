#!/bin/bash

# Snake Showdown Live - Docker Helper Script

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Commands
cmd_start() {
    print_header "Starting Snake Showdown Live"
    docker-compose up -d
    print_success "Services started!"
    print_info "Frontend: http://localhost"
    print_info "Backend API: http://localhost:8000"
    print_info "API Docs: http://localhost:8000/docs"
}

cmd_stop() {
    print_header "Stopping services"
    docker-compose down
    print_success "Services stopped!"
}

cmd_restart() {
    print_header "Restarting services"
    docker-compose restart
    print_success "Services restarted!"
}

cmd_build() {
    print_header "Building services"
    docker-compose build
    print_success "Build complete!"
}

cmd_rebuild() {
    print_header "Rebuilding and restarting services"
    docker-compose down
    docker-compose up --build -d
    print_success "Services rebuilt and started!"
}

cmd_logs() {
    service=${1:-}
    if [ -z "$service" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$service"
    fi
}

cmd_status() {
    print_header "Service Status"
    docker-compose ps
}

cmd_shell() {
    service=${1:-backend}
    print_info "Opening shell in $service..."
    docker-compose exec "$service" sh
}

cmd_db_shell() {
    print_info "Opening PostgreSQL shell..."
    docker-compose exec db psql -U snake_user -d snake_showdown
}

cmd_reset_db() {
    print_header "Resetting Database"
    print_info "This will delete all data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        docker-compose up -d db
        sleep 5
        docker-compose up -d backend
        print_success "Database reset complete!"
    else
        print_info "Cancelled"
    fi
}

cmd_clean() {
    print_header "Cleaning up Docker resources"
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup complete!"
}

cmd_test() {
    service=${1:-backend}
    print_header "Running tests in $service"
    if [ "$service" = "backend" ]; then
        docker-compose exec backend uv run pytest -v
    elif [ "$service" = "frontend" ]; then
        docker-compose exec frontend npm test
    else
        print_error "Unknown service: $service"
        exit 1
    fi
}

cmd_help() {
    cat << EOF
${BLUE}Snake Showdown Live - Docker Helper${NC}

${GREEN}Usage:${NC}
  ./docker.sh [command] [options]

${GREEN}Commands:${NC}
  start           Start all services in background
  stop            Stop all services
  restart         Restart all services
  build           Build all services
  rebuild         Stop, rebuild, and restart all services
  logs [service]  Show logs (all or specific service)
  status          Show service status
  shell [service] Open shell in service (default: backend)
  db-shell        Open PostgreSQL shell
  reset-db        Reset database (deletes all data!)
  clean           Stop services and clean up Docker resources
  test [service]  Run tests (default: backend)
  help            Show this help message

${GREEN}Examples:${NC}
  ./docker.sh start
  ./docker.sh logs backend
  ./docker.sh shell frontend
  ./docker.sh test backend

${GREEN}Services:${NC}
  - frontend (React + Nginx)
  - backend (FastAPI)
  - db (PostgreSQL)

${YELLOW}For more detailed documentation, see DOCKER.md${NC}
EOF
}

# Main
command=${1:-help}
shift || true

case "$command" in
    start)
        cmd_start "$@"
        ;;
    stop)
        cmd_stop "$@"
        ;;
    restart)
        cmd_restart "$@"
        ;;
    build)
        cmd_build "$@"
        ;;
    rebuild)
        cmd_rebuild "$@"
        ;;
    logs)
        cmd_logs "$@"
        ;;
    status)
        cmd_status "$@"
        ;;
    shell)
        cmd_shell "$@"
        ;;
    db-shell)
        cmd_db_shell "$@"
        ;;
    reset-db)
        cmd_reset_db "$@"
        ;;
    clean)
        cmd_clean "$@"
        ;;
    test)
        cmd_test "$@"
        ;;
    help|--help|-h)
        cmd_help
        ;;
    *)
        print_error "Unknown command: $command"
        echo ""
        cmd_help
        exit 1
        ;;
esac
