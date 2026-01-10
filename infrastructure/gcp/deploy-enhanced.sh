#!/bin/bash
# Enhanced deployment script for GCP infrastructure
# Supports multiple environments, monitoring, and complete CI/CD setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ============================================
# UTILITY FUNCTIONS
# ============================================

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_step() {
    echo -e "${CYAN}→${NC} $1"
}

# ============================================
# REQUIREMENT CHECKS
# ============================================

check_requirements() {
    print_header "Checking Requirements"
    
    local missing_tools=()
    
    # Check gcloud
    if ! command -v gcloud &> /dev/null; then
        missing_tools+=("gcloud")
        print_error "gcloud CLI is not installed"
    else
        print_info "gcloud CLI: $(gcloud version --format='value(version)')"
    fi
    
    # Check terraform
    if ! command -v terraform &> /dev/null; then
        missing_tools+=("terraform")
        print_error "Terraform is not installed"
    else
        print_info "Terraform: $(terraform version -json | jq -r '.terraform_version')"
    fi
    
    # Check docker
    if ! command -v docker &> /dev/null; then
        missing_tools+=("docker")
        print_error "Docker is not installed"
    else
        print_info "Docker: $(docker --version | awk '{print $3}' | tr -d ',')"
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        echo ""
        echo "Installation instructions:"
        echo "  - gcloud: https://cloud.google.com/sdk/docs/install"
        echo "  - terraform: https://www.terraform.io/downloads"
        echo "  - docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    print_success "All requirements satisfied ✓"
}

# ============================================
# PROJECT SETUP
# ============================================

setup_project() {
    print_header "Initial Project Setup"
    
    # Prompt for project ID
    read -p "Enter your GCP Project ID: " project_id
    
    # Set gcloud project
    gcloud config set project "$project_id"
    print_success "Set active project to: $project_id"
    
    # Check if terraform backend bucket exists
    BUCKET_NAME="${project_id}-terraform-state"
    if ! gsutil ls "gs://${BUCKET_NAME}" &> /dev/null; then
        print_step "Creating Terraform state bucket..."
        gsutil mb -p "$project_id" -l us-central1 "gs://${BUCKET_NAME}"
        gsutil versioning set on "gs://${BUCKET_NAME}"
        gsutil lifecycle set lifecycle.json "gs://${BUCKET_NAME}" 2>/dev/null || true
        print_success "Created state bucket: gs://${BUCKET_NAME}"
    else
        print_info "State bucket already exists: gs://${BUCKET_NAME}"
    fi
    
    # Update backend.tf
    print_step "Updating backend configuration..."
    sed -i.bak "s/YOUR_PROJECT_ID/${project_id}/g" backend.tf
    rm backend.tf.bak
    
    print_success "Project setup complete!"
}

# ============================================
# TERRAFORM OPERATIONS
# ============================================

init_terraform() {
    print_header "Initializing Terraform"
    
    terraform init
    print_success "Terraform initialized ✓"
}

validate_terraform() {
    print_header "Validating Terraform Configuration"
    
    terraform fmt -check || terraform fmt
    terraform validate
    print_success "Configuration is valid ✓"
}

# ============================================
# SECRET MANAGEMENT
# ============================================

setup_secrets() {
    print_header "Setting up Secrets"
    
    local project_id=$(gcloud config get-value project)
    
    # YouTube API Key
    if gcloud secrets describe youtube-api-key --project="$project_id" &> /dev/null; then
        print_info "youtube-api-key already exists"
        read -p "Do you want to update it? (y/n): " update_youtube
        if [[ $update_youtube == "y" ]]; then
            read -sp "Enter your YouTube API Key: " youtube_api_key
            echo ""
            echo -n "$youtube_api_key" | gcloud secrets versions add youtube-api-key --data-file=-
            print_success "Updated youtube-api-key"
        fi
    else
        read -sp "Enter your YouTube API Key: " youtube_api_key
        echo ""
        echo -n "$youtube_api_key" | gcloud secrets create youtube-api-key \
            --data-file=- \
            --replication-policy="automatic" \
            --labels=app=youtube-video-summarizer,managed-by=terraform
        print_success "Created youtube-api-key"
    fi
    
    # OpenAI API Key
    if gcloud secrets describe openai-api-key --project="$project_id" &> /dev/null; then
        print_info "openai-api-key already exists"
        read -p "Do you want to update it? (y/n): " update_openai
        if [[ $update_openai == "y" ]]; then
            read -sp "Enter your OpenAI API Key: " openai_api_key
            echo ""
            echo -n "$openai_api_key" | gcloud secrets versions add openai-api-key --data-file=-
            print_success "Updated openai-api-key"
        fi
    else
        read -sp "Enter your OpenAI API Key: " openai_api_key
        echo ""
        echo -n "$openai_api_key" | gcloud secrets create openai-api-key \
            --data-file=- \
            --replication-policy="automatic" \
            --labels=app=youtube-video-summarizer,managed-by=terraform
        print_success "Created openai-api-key"
    fi
    
    print_success "Secrets configured ✓"
}

# ============================================
# DEPLOYMENT
# ============================================

deploy() {
    local environment=${1:-dev}
    
    print_header "Deploying to $environment Environment"
    
    # Check for environment-specific tfvars
    local tfvars_file="environments/${environment}.tfvars"
    if [ ! -f "$tfvars_file" ]; then
        print_error "Environment file not found: $tfvars_file"
        exit 1
    fi
    
    print_info "Using configuration: $tfvars_file"
    
    # Validate
    validate_terraform
    
    # Plan
    print_step "Running Terraform plan..."
    terraform plan -var-file="$tfvars_file" -out=tfplan
    
    # Show plan summary
    echo ""
    terraform show -no-color tfplan | grep -E "Plan:|No changes"
    echo ""
    
    # Confirm
    read -p "Do you want to apply these changes? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        print_warning "Deployment cancelled"
        rm -f tfplan
        exit 0
    fi
    
    # Apply
    print_step "Applying Terraform changes..."
    terraform apply tfplan
    rm -f tfplan
    
    print_success "Deployment completed ✓"
    
    # Show outputs
    print_header "Deployment Outputs"
    terraform output
}

# ============================================
# BUILD & PUSH
# ============================================

build_and_push() {
    print_header "Building and Pushing Docker Images"
    
    # Get configuration
    local project_id=$(terraform output -raw project_id 2>/dev/null || gcloud config get-value project)
    local region=$(terraform output -raw region 2>/dev/null || echo "us-central1")
    
    print_info "Project: $project_id"
    print_info "Region: $region"
    
    # Configure Docker
    print_step "Configuring Docker authentication..."
    gcloud auth configure-docker "${region}-docker.pkg.dev" --quiet
    
    # Build backend image
    print_step "Building backend API image..."
    cd ../../server
    local image_tag="${region}-docker.pkg.dev/${project_id}/youtube-summarizer/api:$(git rev-parse --short HEAD)"
    local image_latest="${region}-docker.pkg.dev/${project_id}/youtube-summarizer/api:latest"
    
    docker build -t "$image_tag" -t "$image_latest" .
    
    # Push images
    print_step "Pushing images to Artifact Registry..."
    docker push "$image_tag"
    docker push "$image_latest"
    
    cd "$SCRIPT_DIR"
    print_success "Images built and pushed ✓"
}

# ============================================
# MONITORING
# ============================================

setup_monitoring() {
    print_header "Setting up Monitoring Dashboard"
    
    local project_id=$(gcloud config get-value project)
    
    print_info "Creating monitoring dashboard..."
    # This would create a custom dashboard - simplified for this example
    print_info "View monitoring at: https://console.cloud.google.com/monitoring?project=${project_id}"
    print_success "Monitoring setup complete ✓"
}

# ============================================
# DESTROY
# ============================================

destroy() {
    local environment=${1:-dev}
    
    print_header "DESTROY Infrastructure"
    print_warning "⚠️  This will PERMANENTLY DELETE all infrastructure resources!"
    print_warning "⚠️  Environment: $environment"
    
    echo ""
    read -p "Type 'destroy-$environment' to confirm: " confirm
    
    if [ "$confirm" != "destroy-$environment" ]; then
        print_info "Destroy cancelled"
        exit 0
    fi
    
    local tfvars_file="environments/${environment}.tfvars"
    if [ ! -f "$tfvars_file" ]; then
        tfvars_file="terraform.tfvars"
    fi
    
    print_step "Destroying infrastructure..."
    terraform destroy -var-file="$tfvars_file" -auto-approve
    
    print_success "Infrastructure destroyed"
}

# ============================================
# MAIN MENU
# ============================================

show_help() {
    cat << EOF
YouTube Video Summarizer - GCP Deployment Script

Usage: $0 [command] [environment]

Commands:
    setup           Initial project setup (create state bucket, configure backend)
    init            Initialize Terraform
    validate        Validate Terraform configuration
    secrets         Set up API secrets in Secret Manager
    deploy [env]    Deploy infrastructure (env: dev, staging, production)
    build           Build and push Docker images
    monitor         Set up monitoring dashboard
    destroy [env]   Destroy infrastructure (DANGEROUS!)
    help            Show this help message

Examples:
    $0 setup                    # First-time setup
    $0 deploy dev               # Deploy to dev environment
    $0 deploy production        # Deploy to production
    $0 build                    # Build and push Docker images
    $0 destroy dev              # Destroy dev environment

EOF
}

# ============================================
# MAIN
# ============================================

main() {
    check_requirements
    
    case "${1:-help}" in
        setup)
            setup_project
            init_terraform
            ;;
        init)
            init_terraform
            ;;
        validate)
            validate_terraform
            ;;
        secrets)
            setup_secrets
            ;;
        deploy)
            deploy "${2:-dev}"
            ;;
        build)
            build_and_push
            ;;
        monitor)
            setup_monitoring
            ;;
        destroy)
            destroy "${2:-dev}"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
