#!/bin/bash
# Deployment script for GCP infrastructure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_info "Checking requirements..."
    
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI is not installed. Please install it from https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed. Please install it from https://www.terraform.io/downloads"
        exit 1
    fi
    
    print_info "All requirements satisfied ✓"
}

# Initialize Terraform
init_terraform() {
    print_info "Initializing Terraform..."
    cd "$(dirname "$0")"
    terraform init
    print_info "Terraform initialized ✓"
}

# Set secrets in Secret Manager
set_secrets() {
    print_info "Setting up secrets..."
    
    read -p "Enter your YouTube API Key: " youtube_api_key
    read -p "Enter your OpenAI API Key: " openai_api_key
    
    echo -n "$youtube_api_key" | gcloud secrets create youtube-api-key \
        --data-file=- \
        --labels=app=youtube-video-summarizer,managed-by=terraform \
        || echo "Secret youtube-api-key might already exist"
    
    echo -n "$openai_api_key" | gcloud secrets create openai-api-key \
        --data-file=- \
        --labels=app=youtube-video-summarizer,managed-by=terraform \
        || echo "Secret openai-api-key might already exist"
    
    print_info "Secrets configured ✓"
}

# Deploy infrastructure
deploy() {
    local environment=${1:-dev}
    
    print_info "Deploying to $environment environment..."
    
    # Check if tfvars file exists
    if [ ! -f "terraform.tfvars" ]; then
        print_warning "terraform.tfvars not found. Using terraform.tfvars.example as template."
        print_info "Please create terraform.tfvars with your actual values."
        exit 1
    fi
    
    # Plan
    print_info "Running Terraform plan..."
    terraform plan -var="environment=$environment" -out=tfplan
    
    # Apply
    read -p "Do you want to apply these changes? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        print_info "Applying Terraform changes..."
        terraform apply tfplan
        rm tfplan
        print_info "Deployment completed ✓"
        
        # Show outputs
        print_info "Deployment outputs:"
        terraform output
    else
        print_warning "Deployment cancelled"
        rm tfplan
    fi
}

# Build and push Docker image
build_and_push() {
    print_info "Building and pushing Docker image..."
    
    # Get project ID and region from terraform
    PROJECT_ID=$(terraform output -raw project_id 2>/dev/null || echo "")
    REGION=$(terraform output -raw region 2>/dev/null || echo "us-central1")
    
    if [ -z "$PROJECT_ID" ]; then
        read -p "Enter your GCP Project ID: " PROJECT_ID
    fi
    
    # Configure Docker to use gcloud as credential helper
    gcloud auth configure-docker ${REGION}-docker.pkg.dev
    
    # Build and push
    cd ../../server
    docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/youtube-summarizer/api:latest .
    docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/youtube-summarizer/api:latest
    
    print_info "Docker image built and pushed ✓"
}

# Destroy infrastructure
destroy() {
    print_warning "This will destroy all infrastructure resources!"
    read -p "Are you sure? Type 'destroy' to confirm: " confirm
    
    if [ "$confirm" = "destroy" ]; then
        print_info "Destroying infrastructure..."
        terraform destroy
        print_info "Infrastructure destroyed"
    else
        print_warning "Destroy cancelled"
    fi
}

# Main script
main() {
    check_requirements
    
    case "${1:-deploy}" in
        init)
            init_terraform
            ;;
        secrets)
            set_secrets
            ;;
        deploy)
            init_terraform
            deploy "${2:-dev}"
            ;;
        build)
            build_and_push
            ;;
        destroy)
            destroy
            ;;
        *)
            echo "Usage: $0 {init|secrets|deploy|build|destroy} [environment]"
            echo ""
            echo "Commands:"
            echo "  init     - Initialize Terraform"
            echo "  secrets  - Set up API secrets in Secret Manager"
            echo "  deploy   - Deploy infrastructure (default: dev)"
            echo "  build    - Build and push Docker image"
            echo "  destroy  - Destroy all infrastructure"
            exit 1
            ;;
    esac
}

main "$@"
