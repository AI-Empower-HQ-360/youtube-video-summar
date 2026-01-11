#!/bin/bash

# VidNote Test Runner
# Comprehensive test execution script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Default values
TEST_TYPE="all"
COVERAGE=false
HEADED=false
BROWSER="chromium"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --unit)
            TEST_TYPE="unit"
            shift
            ;;
        --integration)
            TEST_TYPE="integration"
            shift
            ;;
        --e2e)
            TEST_TYPE="e2e"
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --headed)
            HEADED=true
            shift
            ;;
        --browser)
            BROWSER="$2"
            shift 2
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Main test execution
print_header "VidNote Test Suite"

# Environment check
print_info "Checking environment..."
if [ ! -d "node_modules" ]; then
    print_error "node_modules not found. Run 'npm install' first."
    exit 1
fi
print_success "Environment OK"

# Run tests based on type
case $TEST_TYPE in
    unit)
        print_header "Running Unit Tests"
        if [ "$COVERAGE" = true ]; then
            npm run test:unit -- --coverage
        else
            npm run test:unit
        fi
        ;;
    
    integration)
        print_header "Running Integration Tests"
        npm run test:integration
        ;;
    
    e2e)
        print_header "Running E2E Tests"
        
        # Start servers
        print_info "Starting development servers..."
        npm run dev &
        FRONTEND_PID=$!
        
        cd server && npm run dev &
        BACKEND_PID=$!
        cd ..
        
        # Wait for servers to be ready
        print_info "Waiting for servers..."
        sleep 10
        
        # Run E2E tests
        if [ "$HEADED" = true ]; then
            npm run test:e2e:headed -- --project=$BROWSER
        else
            npm run test:e2e -- --project=$BROWSER
        fi
        
        # Cleanup
        print_info "Stopping servers..."
        kill $FRONTEND_PID $BACKEND_PID 2>/dev/null || true
        ;;
    
    all)
        print_header "Running All Tests"
        
        # Unit tests
        print_info "1/3 Running unit tests..."
        if [ "$COVERAGE" = true ]; then
            npm run test:run -- --coverage
        else
            npm run test:run
        fi
        print_success "Unit tests passed"
        
        # Integration tests
        print_info "2/3 Running integration tests..."
        npm run test:integration
        print_success "Integration tests passed"
        
        # E2E tests
        print_info "3/3 Running E2E tests..."
        npm run test:e2e -- --project=chromium
        print_success "E2E tests passed"
        ;;
esac

print_header "Test Suite Complete"
print_success "All tests passed!"

# Coverage report
if [ "$COVERAGE" = true ]; then
    print_info "Coverage report available at: coverage/index.html"
fi

# E2E report
if [ "$TEST_TYPE" = "e2e" ] || [ "$TEST_TYPE" = "all" ]; then
    print_info "E2E report available at: playwright-report/index.html"
    print_info "Run 'npm run test:e2e:report' to view"
fi
