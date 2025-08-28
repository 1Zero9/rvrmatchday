#!/bin/bash

# Robust Dev Server Management Script
# Handles crashes, auto-restarts, and provides health checks

PROJECT_DIR="/Users/stephencranfield/Documents/Projects/rvrmatchday"
PORT=3000
MAX_RESTARTS=5
RESTART_COUNT=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Clean up function
cleanup() {
    log "Cleaning up..."
    
    # Kill any existing Next.js processes
    pkill -f "next dev" 2>/dev/null || true
    
    # Kill anything using port 3000
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    
    # Wait a moment
    sleep 2
    
    success "Cleanup completed"
}

# Check if port is available
check_port() {
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        error "Port $PORT is already in use"
        return 1
    fi
    return 0
}

# Health check function
health_check() {
    local max_attempts=30
    local attempt=0
    
    log "Performing health check..."
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:$PORT >/dev/null 2>&1; then
            success "Server is healthy and responding on port $PORT"
            return 0
        fi
        
        attempt=$((attempt + 1))
        log "Health check attempt $attempt/$max_attempts..."
        sleep 2
    done
    
    error "Server failed health check after $max_attempts attempts"
    return 1
}

# Start the dev server
start_server() {
    log "Starting Next.js dev server..."
    
    cd "$PROJECT_DIR" || {
        error "Failed to change to project directory: $PROJECT_DIR"
        exit 1
    }
    
    # Start the dev server in the background
    npm run dev &
    SERVER_PID=$!
    
    log "Server started with PID: $SERVER_PID"
    
    # Give it a moment to start
    sleep 5
    
    # Check if the server is still running
    if ! kill -0 $SERVER_PID 2>/dev/null; then
        error "Server process died immediately"
        return 1
    fi
    
    # Perform health check
    if health_check; then
        success "Dev server is running successfully!"
        log "Access your app at: http://localhost:$PORT"
        return 0
    else
        error "Server failed health check"
        kill $SERVER_PID 2>/dev/null || true
        return 1
    fi
}

# Monitor and restart if needed
monitor_server() {
    while true; do
        if ! curl -s http://localhost:$PORT >/dev/null 2>&1; then
            warning "Server is not responding!"
            
            if [ $RESTART_COUNT -lt $MAX_RESTARTS ]; then
                RESTART_COUNT=$((RESTART_COUNT + 1))
                warning "Attempting restart $RESTART_COUNT/$MAX_RESTARTS..."
                
                cleanup
                sleep 5
                
                if start_server; then
                    success "Server restarted successfully"
                    RESTART_COUNT=0  # Reset counter on successful restart
                else
                    error "Failed to restart server"
                fi
            else
                error "Maximum restart attempts reached ($MAX_RESTARTS). Exiting."
                exit 1
            fi
        fi
        
        # Check every 30 seconds
        sleep 30
    done
}

# Main execution
main() {
    log "Starting robust dev server management..."
    
    # Initial cleanup
    cleanup
    
    # Check if port is available
    if ! check_port; then
        cleanup
        sleep 3
        if ! check_port; then
            error "Unable to free port $PORT. Exiting."
            exit 1
        fi
    fi
    
    # Start the server
    if start_server; then
        log "Server started successfully. Beginning monitoring..."
        monitor_server
    else
        error "Failed to start server"
        exit 1
    fi
}

# Handle signals
trap cleanup EXIT INT TERM

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi