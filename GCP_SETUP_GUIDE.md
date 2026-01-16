# GCP Setup Guide: Budget Alerts & VM Creation

## Part 1: Setting Up a $5 Budget Alert

### Prerequisites
- Active GCP account with billing enabled
- `gcloud` CLI installed and authenticated
- Project ID ready

### Steps to Create $5 Budget Alert

#### Option A: Using the GCP Console (Recommended for Beginners)

1. **Navigate to Billing**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Click the **Billing** menu on the left sidebar
   - Select your project

2. **Create Budget Alert**
   - Click **Budgets and alerts** in the left menu
   - Click **Create Budget**
   - Set the following:
     - **Budget name**: "YouTube Summarizer $5 Alert"
     - **Budget type**: "Specified amount"
     - **Budget amount**: `5.00 USD`
     - **Billing account**: Select your account

3. **Set Alert Thresholds**
   - Click **Set alert rules**
   - Add the following thresholds:
     - **50% of budget** ($2.50) - Alert type: Email
     - **75% of budget** ($3.75) - Alert type: Email
     - **100% of budget** ($5.00) - Alert type: Email
     - **110% of budget** ($5.50) - Alert type: Email

4. **Configure Notifications**
   - Under **Notification channels**, select your email address
   - If no email channel exists, click **Manage notification channels** to create one
   - Click **Create Budget**

#### Option B: Using the Budget Alerts Script

The project includes an automated setup script:

```bash
cd /workspaces/youtube-video-summar/infrastructure/gcp
bash budget-alerts.sh
```

When prompted:
- **Project ID**: Your GCP project ID
- **Email address**: Your notification email
- **Monthly budget amount**: `5`

This script will:
- Create a Pub/Sub topic for alerts
- Set up notification channels
- Configure threshold rules (50%, 75%, 90%, 100%, 110%)

#### Option C: Using Terraform

Add to your `terraform.tfvars`:
```hcl
budget_alert_amount = 5
budget_alert_email  = "your-email@example.com"
```

Then apply:
```bash
cd infrastructure/gcp
terraform plan
terraform apply
```

---

## Part 2: Creating an e2-micro Ubuntu VM on GCP

### Prerequisites
- Billing account linked to GCP project
- Compute Engine API enabled
- GCP Console access

### Step-by-Step VM Creation

#### 1. Enable Required APIs

Via GCP Console:
1. Go to [APIs & Services](https://console.cloud.google.com/apis)
2. Click **Enable APIs and Services**
3. Search for and enable:
   - **Compute Engine API**
   - **Cloud Logging API** (optional, for monitoring)
4. Wait for APIs to be enabled (usually 2-3 minutes)

Via gcloud CLI:
```bash
gcloud services enable compute.googleapis.com
gcloud services enable logging.googleapis.com
```

#### 2. Create VM Instance

**Via GCP Console:**

1. Navigate to **Compute Engine** → **VM instances**
   - URL: https://console.cloud.google.com/compute/instances

2. Click **Create Instance**

3. Configure the VM:
   - **Name**: `youtube-summarizer-dev` (or your preferred name)
   - **Region**: `us-central1` (or your preferred region)
   - **Zone**: `us-central1-a`
   
4. **Machine Configuration**
   - **Machine type**: `e2-micro`
   - This is eligible for **Google Cloud's Always Free tier** (30 GB/month network egress, eligible for 1 free e2-micro instance)

5. **Boot Disk**
   - **Operating System**: `Ubuntu`
   - **Version**: `Ubuntu 24.04 LTS` (or latest LTS)
   - **Boot disk type**: `Standard persistent disk` (10 GB recommended)

6. **Firewall**
   - Check: ☑️ **Allow HTTP traffic**
   - Check: ☑️ **Allow HTTPS traffic**

7. **Advanced Options** (Optional)
   - **Service account**: `Compute Engine default service account`
   - **Access scopes**: `Allow default access`

8. Click **Create**

**Via gcloud CLI:**

```bash
gcloud compute instances create youtube-summarizer-dev \
  --zone=us-central1-a \
  --machine-type=e2-micro \
  --image-family=ubuntu-2404-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=10GB \
  --allow-http \
  --allow-https
```

#### 3. Connect via Browser SSH

Once the VM is created:

1. **Via GCP Console (Easiest)**
   - Go to **Compute Engine** → **VM instances**
   - Click the **SSH** button in the Connect column
   - A browser window opens with terminal access

2. **Via gcloud CLI**
   ```bash
   gcloud compute ssh youtube-summarizer-dev --zone=us-central1-a
   ```

3. **Verify Connection**
   ```bash
   # You should now be in the VM terminal
   whoami  # Should show: ubuntu
   uname -a  # Shows system info
   ```

---

## Part 3: Setting Up Your Development Environment on the VM

Once connected via SSH, run these commands:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Clone the repository
git clone https://github.com/AI-Empower-HQ-360/youtube-video-summar.git
cd youtube-video-summar

# Install dependencies
npm install

# Start the application
./start.sh
```

---

## Part 4: Cost Monitoring

### Monitor Your Spending

1. **Daily Checks**
   - Go to **Billing** → **Reports**
   - View current month's spending
   - Compare against your $5 budget

2. **Set Up Alerts in Cloud Monitoring**
   - Create custom alerts for resource usage
   - Monitor CPU, memory, and network costs

3. **Use Cost Analysis Tool**
   ```bash
   cd infrastructure/gcp
   bash cost-estimator.sh
   ```

### Cost-Saving Tips for e2-micro VM

- **Use Always-Free Tier**: 1 free e2-micro instance per region
- **Disable VM when not in use**: Stop the instance (not delete)
- **Use sustained-use discounts**: Automatically applied for resources running >25% of month
- **Schedule VM startups/shutdowns**: Use Cloud Scheduler to turn off at night

---

## Part 5: Cleanup & Cost Control

### Stop VM (Don't Delete)
```bash
gcloud compute instances stop youtube-summarizer-dev --zone=us-central1-a
```

### Restart VM
```bash
gcloud compute instances start youtube-summarizer-dev --zone=us-central1-a
```

### Delete VM (Permanent)
```bash
gcloud compute instances delete youtube-summarizer-dev --zone=us-central1-a
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Compute Engine API not enabled"** | Run `gcloud services enable compute.googleapis.com` |
| **"Billing account not linked"** | Go to Billing → Account Management → Link account |
| **"SSH connection timeout"** | Ensure firewall allows SSH (port 22). Check GCP Firewall rules. |
| **"quota exceeded"** | Check your regional quotas under **IAM & Admin** → **Quotas** |
| **"Budget alert not sending"** | Verify email in notification channels and check spam folder |

---

## Quick Reference Commands

```bash
# List all VMs
gcloud compute instances list

# Get VM details
gcloud compute instances describe youtube-summarizer-dev --zone=us-central1-a

# View budget status
gcloud billing budgets list --billing-account=BILLING_ACCOUNT_ID

# Check current project
gcloud config get-value project

# Set default zone (saves typing)
gcloud config set compute/zone us-central1-a
```

---

## Next Steps

1. ✅ Budget alert configured ($5)
2. ✅ VM created and accessible
3. ⏭️ Deploy the YouTube Summarizer application
4. ⏭️ Monitor costs and usage
5. ⏭️ Scale based on traffic needs

For deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
