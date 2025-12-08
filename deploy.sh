#!/bin/bash

# Single Container Deployment Helper Script

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

cmd_start() {
    print_header "Starting Single Container Deployment"
    docker-compose -f docker-compose.single.yml up -d
    print_success "Application started!"
    print_info "Access at: http://localhost"
    print_info "API Docs: http://localhost/docs"
}

cmd_stop() {
    print_header "Stopping services"
    docker-compose -f docker-compose.single.yml down
    print_success "Services stopped!"
}

cmd_build() {
    print_header "Building single container"
    docker-compose -f docker-compose.single.yml build
    print_success "Build complete!"
}

cmd_rebuild() {
    print_header "Rebuilding and restarting"
    docker-compose -f docker-compose.single.yml down
    docker-compose -f docker-compose.single.yml up --build -d
    print_success "Services rebuilt and started!"
}

cmd_logs() {
    docker-compose -f docker-compose.single.yml logs -f app
}

cmd_status() {
    print_header "Service Status"
    docker-compose -f docker-compose.single.yml ps
}

cmd_shell() {
    print_info "Opening shell in app container..."
    docker-compose -f docker-compose.single.yml exec app bash
}

cmd_supervisor() {
    print_info "Supervisord status..."
    docker-compose -f docker-compose.single.yml exec app supervisorctl status
}

cmd_restart_backend() {
    print_info "Restarting backend..."
    docker-compose -f docker-compose.single.yml exec app supervisorctl restart backend
    print_success "Backend restarted!"
}

cmd_restart_nginx() {
    print_info "Restarting nginx..."
    docker-compose -f docker-compose.single.yml exec app supervisorctl restart nginx
    print_success "Nginx restarted!"
}

cmd_help() {
    cat << EOF
${BLUE}Snake Showdown Live - Single Container Deployment${NC}

${GREEN}Usage:${NC}
  ./deploy.sh [command]

${GREEN}Commands:${NC}
  start              Start the application
  stop               Stop all services
  build              Build the container
  rebuild            Rebuild and restart
  logs               Show application logs
  status             Show service status
  shell              Open shell in app container
  supervisor         Show supervisord status
  restart-backend    Restart backend process
  restart-nginx      Restart nginx process
  help               Show this help message

${GREEN}Examples:${NC}
  ./deploy.sh start
  ./deploy.sh logs
  ./deploy.sh supervisor

${YELLOW}For detailed documentation, see DEPLOYMENT_SINGLE.md${NC}
EOF
}

command=${1:-help}

case "$command" in
    start)
        cmd_start
        ;;
    stop)
        cmd_stop
        ;;
    build)
        cmd_build
        ;;
    rebuild)
        cmd_rebuild
        ;;
    logs)
        cmd_logs
        ;;
    status)
        cmd_status
        ;;
    shell)
        cmd_shell
        ;;
    supervisor)
        cmd_supervisor
        ;;
    restart-backend)
        cmd_restart_backend
        ;;
    restart-nginx)
        cmd_restart_nginx
        ;;
    help|--help|-h)
        cmd_help
        ;;
    *)
        print_info "Unknown command: $command"
        echo ""
        cmd_help
        exit 1
        ;;
esac
