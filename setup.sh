#!/bin/bash
# Quick setup script for YouTube Video Summarizer

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

print_info() {
    echo -e "${BLUE}→${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup
main() {
    print_header "YouTube Video Summarizer - Setup Script"

    # Check Node.js
    print_info "Checking Node.js..."
    if command_exists node; then
        NODE_VERSION=$(node -v)
        print_success "Node.js $NODE_VERSION installed"
    else
        print_error "Node.js is not installed"
        echo "Please install Node.js v18+ from https://nodejs.org/"
        exit 1
    fi

    # Check npm
    print_info "Checking npm..."
    if command_exists npm; then
        NPM_VERSION=$(npm -v)
        print_success "npm $NPM_VERSION installed"
    else
        print_error "npm is not installed"
        exit 1
    fi

    # Install frontend dependencies
    print_header "Installing Frontend Dependencies"
    print_info "Running npm install..."
    npm install
    print_success "Frontend dependencies installed"

    # Install backend dependencies
    print_header "Installing Backend Dependencies"
    print_info "Navigating to server directory..."
    cd server
    print_info "Running npm install..."
    npm install
    print_success "Backend dependencies installed"
    cd ..

    # Setup environment files
    print_header "Setting Up Environment Files"

    # Frontend .env
    if [ ! -f ".env.local" ]; then
        print_info "Creating frontend .env.local..."
        cp .env.example .env.local
        print_warning "Please edit .env.local and add your API keys"
        print_info "Required: VITE_OPENAI_API_KEY"
    else
        print_success ".env.local already exists"
    fi

    # Backend .env
    if [ ! -f "server/.env" ]; then
        print_info "Creating backend .env..."
        cp server/.env.example server/.env
        print_warning "Please edit server/.env and add your API keys"
        print_info "Required: OPENAI_API_KEY"
    else
        print_success "server/.env already exists"
    fi

    # Setup complete
    print_header "Setup Complete!"

    echo ""
    print_success "All dependencies installed successfully"
    echo ""
    print_warning "Next Steps:"
    echo "  1. Edit .env.local and add your API keys"
    echo "  2. Edit server/.env and add your API keys"
    echo ""
    print_info "To start development:"
    echo "  Terminal 1: cd server && npm run dev"
    echo "  Terminal 2: npm run dev"
    echo ""
    print_info "Frontend will run at: http://localhost:5173"
    print_info "Backend will run at: http://localhost:3001"
    echo ""
    print_info "For more information, see SETUP_GUIDE.md"
    echo ""
}

# Run main function
main
