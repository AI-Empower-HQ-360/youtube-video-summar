# Terraform VM Creation Guide

## Prerequisites

Install these on your **local machine** (not the dev container):

1. **Terraform** - https://www.terraform.io/downloads
2. **gcloud CLI** - https://cloud.google.com/sdk/docs/install
3. **Authenticate gcloud**:
   ```bash
   gcloud auth application-default login
   gcloud config set project YOUR_PROJECT_ID
   ```

---

## Step 1: Get Your Project ID

From GCP Console:
1. Click the project dropdown at the top
2. Copy your **Project ID** (e.g., `project-fc16459b-fb23-4965-874`)

---

## Step 2: Create Terraform Configuration File

Create a file: `terraform.tfvars` in `infrastructure/gcp/`

```hcl
project_id  = "YOUR_PROJECT_ID"  # Replace with your actual project ID
region      = "us-central1"
environment = "dev"
```

**Example:**
```hcl
project_id  = "project-fc16459b-fb23-4965-874"
region      = "us-central1"
environment = "dev"
```

---

## Step 3: Initialize Terraform

Run from `infrastructure/gcp/` directory:

```bash
cd infrastructure/gcp
terraform init
```

This downloads the Google Cloud provider and prepares the environment.

---

## Step 4: Review Changes

See what Terraform will create:

```bash
terraform plan
```

You should see:
- 1 Compute Engine instance
- 1 Static IP address
- 2 Firewall rules (HTTP, HTTPS)

---

## Step 5: Create the VM

Apply the configuration:

```bash
terraform apply
```

When prompted, type: **`yes`** and press Enter

⏳ **Wait 2-3 minutes** for the VM to be created...

---

## Step 6: Get Your VM Details

After successful creation, Terraform displays:

```
Outputs:

access_url           = "http://YOUR_IP_ADDRESS"
instance_ip          = "YOUR_EXTERNAL_IP"
instance_internal_ip = "10.128.0.2"
instance_name        = "youtube-summarizer-dev"
ssh_command          = "gcloud compute ssh youtube-summarizer-dev --zone=us-central1-a"
```

---

## Step 7: Connect to Your VM

**Option A: Using gcloud CLI**
```bash
gcloud compute ssh youtube-summarizer-dev --zone=us-central1-a
```

**Option B: Using GCP Console**
1. Go to https://console.cloud.google.com/compute/instances
2. Find `youtube-summarizer-dev`
3. Click the **SSH** button

---

## Step 8: Access Your Application

Once connected, the startup script automatically:
- ✅ Installs Node.js
- ✅ Clones the repository
- ✅ Installs dependencies
- ✅ Starts the application

Access it at:
```
http://YOUR_EXTERNAL_IP:5173
```

Find `YOUR_EXTERNAL_IP` from the Terraform output or GCP Console.

---

## Useful Terraform Commands

```bash
# View current state
terraform state list

# Get VM details
terraform show

# Destroy VM (if needed)
terraform destroy

# Refresh state (sync with GCP)
terraform refresh

# Update specific variables
terraform apply -var="environment=staging"
```

---

## Cleanup (When Done)

To delete the VM and save costs:

```bash
terraform destroy
```

Type **`yes`** when prompted.

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Project not set" | Run: `gcloud config set project YOUR_PROJECT_ID` |
| "Permission denied" | Check authentication: `gcloud auth application-default login` |
| "Resource already exists" | Run: `terraform destroy` then `terraform apply` |
| "API not enabled" | GCP automatically enables required APIs |

---

## Next Steps

1. ✅ VM created
2. ✅ Application deployed
3. ⏭️ Configure environment variables
4. ⏭️ Set up budget alerts (see GCP_SETUP_GUIDE.md)
5. ⏭️ Configure custom domain (optional)
