# =============================================
# GCP Compute Engine VM Configuration
# =============================================
# Creates an e2-micro Ubuntu VM for development

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# =============================================
# Compute Engine Instance
# =============================================

resource "google_compute_instance" "app_vm" {
  name         = "youtube-summarizer-${var.environment}"
  machine_type = "e2-micro"
  zone         = "${var.region}-a"

  # Boot disk configuration
  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2404-lts"
      size  = 10
      type  = "pd-standard"
    }
  }

  # Network interfaces
  network_interface {
    network = "default"
    
    # Assign external IP
    access_config {
      nat_ip = google_compute_address.vm_ip.address
    }
  }

  # Metadata for SSH access
  metadata = {
    enable-oslogin = "true"
  }

  # Startup script
  metadata_startup_script = file("${path.module}/startup-script.sh")

  # Tags for firewall rules
  tags = ["http-server", "https-server"]

  # Labels for organization
  labels = {
    app         = "youtube-summarizer"
    environment = var.environment
    managed_by  = "terraform"
  }

  depends_on = [google_compute_firewall.allow_http, google_compute_firewall.allow_https]
}

# =============================================
# Static External IP
# =============================================

resource "google_compute_address" "vm_ip" {
  name   = "youtube-summarizer-ip-${var.environment}"
  region = var.region
}

# =============================================
# Firewall Rules
# =============================================

resource "google_compute_firewall" "allow_http" {
  name    = "allow-http"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]
}

resource "google_compute_firewall" "allow_https" {
  name    = "allow-https"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["https-server"]
}

# =============================================
# Outputs
# =============================================

output "instance_name" {
  value       = google_compute_instance.app_vm.name
  description = "Name of the Compute Engine instance"
}

output "instance_ip" {
  value       = google_compute_address.vm_ip.address
  description = "External IP address of the instance"
}

output "instance_internal_ip" {
  value       = google_compute_instance.app_vm.network_interface[0].network_ip
  description = "Internal IP address of the instance"
}

output "ssh_command" {
  value       = "gcloud compute ssh ${google_compute_instance.app_vm.name} --zone=${google_compute_instance.app_vm.zone}"
  description = "Command to SSH into the instance"
}

output "access_url" {
  value       = "http://${google_compute_address.vm_ip.address}"
  description = "URL to access the application"
}
