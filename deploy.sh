#!/bin/bash

# 🚀 Todo Task Management - Deployment Script
# This script helps deploy the application for the hackathon submission

set -e

echo "🚀 Starting deployment process for Todo Task Management..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed. Please install git first."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install backend dependencies
    cd backend
    npm install
    cd ..
    
    # Install frontend dependencies
    cd frontend
    npm install
    cd ..
    
    print_success "Dependencies installed successfully"
}

# Build the application
build_application() {
    print_status "Building application..."
    
    # Build frontend
    cd frontend
    npm run build
    cd ..
    
    print_success "Application built successfully"
}

# Check environment variables
check_environment() {
    print_status "Checking environment variables..."
    
    if [ ! -f "backend/.env" ]; then
        print_warning "backend/.env file not found. Please create it with the following variables:"
        echo "PORT=5000"
        echo "NODE_ENV=development"
        echo "MONGODB_URI=your-mongodb-connection-string"
        echo "JWT_SECRET=your-jwt-secret"
        echo "GOOGLE_CLIENT_ID=your-google-client-id"
        echo "GOOGLE_CLIENT_SECRET=your-google-client-secret"
        echo "GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback"
        echo "FRONTEND_URL=http://localhost:3000"
    else
        print_success "Backend environment file found"
    fi
    
    if [ ! -f "frontend/.env" ]; then
        print_warning "frontend/.env file not found. Please create it with the following variables:"
        echo "VITE_API_URL=http://localhost:5000/api"
        echo "VITE_SOCKET_URL=http://localhost:5000"
    else
        print_success "Frontend environment file found"
    fi
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Backend tests
    cd backend
    if npm test; then
        print_success "Backend tests passed"
    else
        print_error "Backend tests failed"
        exit 1
    fi
    cd ..
    
    # Frontend tests (if available)
    cd frontend
    if npm test; then
        print_success "Frontend tests passed"
    else
        print_warning "Frontend tests not available or failed"
    fi
    cd ..
}

# Start development servers
start_development() {
    print_status "Starting development servers..."
    
    # Start backend
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Development servers started"
    print_status "Backend: http://localhost:5000"
    print_status "Frontend: http://localhost:3000"
    print_status "Press Ctrl+C to stop servers"
    
    # Wait for user to stop
    wait $BACKEND_PID $FRONTEND_PID
}

# Deploy to production
deploy_production() {
    print_status "Starting production deployment..."
    
    echo "This will deploy to Railway (backend) and Vercel (frontend)"
    echo "Make sure you have:"
    echo "1. Railway CLI installed and logged in"
    echo "2. Vercel CLI installed and logged in"
    echo "3. MongoDB Atlas database set up"
    echo "4. Google OAuth credentials configured"
    
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Deployment cancelled"
        exit 0
    fi
    
    # Deploy backend to Railway
    print_status "Deploying backend to Railway..."
    cd backend
    if railway up; then
        print_success "Backend deployed to Railway"
    else
        print_error "Backend deployment failed"
        exit 1
    fi
    cd ..
    
    # Deploy frontend to Vercel
    print_status "Deploying frontend to Vercel..."
    cd frontend
    if vercel --prod; then
        print_success "Frontend deployed to Vercel"
    else
        print_error "Frontend deployment failed"
        exit 1
    fi
    cd ..
    
    print_success "Production deployment completed!"
}

# Show help
show_help() {
    echo "🚀 Todo Task Management - Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  check       Check dependencies and environment"
    echo "  install     Install all dependencies"
    echo "  build       Build the application"
    echo "  test        Run tests"
    echo "  dev         Start development servers"
    echo "  deploy      Deploy to production"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 check     # Check if everything is ready"
    echo "  $0 dev       # Start development servers"
    echo "  $0 deploy    # Deploy to production"
}

# Main script logic
case "${1:-help}" in
    "check")
        check_dependencies
        check_environment
        ;;
    "install")
        check_dependencies
        install_dependencies
        ;;
    "build")
        install_dependencies
        build_application
        ;;
    "test")
        install_dependencies
        run_tests
        ;;
    "dev")
        check_dependencies
        install_dependencies
        check_environment
        start_development
        ;;
    "deploy")
        check_dependencies
        install_dependencies
        build_application
        run_tests
        deploy_production
        ;;
    "help"|*)
        show_help
        ;;
esac

print_success "Script completed successfully!" 