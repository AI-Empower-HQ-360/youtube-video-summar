# Terraform Backend Configuration for State Management
# This stores Terraform state in Google Cloud Storage for team collaboration

terraform {
  backend "gcs" {
    bucket = "YOUR_PROJECT_ID-terraform-state"  # Replace with your GCS bucket
    prefix = "terraform/state"
  }
}

# To use this backend:
# 1. Create a GCS bucket for state:
#    gsutil mb -p YOUR_PROJECT_ID -l us-central1 gs://YOUR_PROJECT_ID-terraform-state
# 
# 2. Enable versioning for safety:
#    gsutil versioning set on gs://YOUR_PROJECT_ID-terraform-state
#
# 3. Update bucket name above with your actual project ID
#
# 4. Run: terraform init -migrate-state
