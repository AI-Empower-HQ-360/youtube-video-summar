#!/bin/bash

# =============================================
# Startup Script for YouTube Summarizer VM
# =============================================
# This script runs when the VM starts

set -e

echo "Starting YouTube Summarizer setup..."

# Update system packages
apt update
apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Git
apt install -y git

# Install Docker (optional but useful)
apt install -y docker.io

# Create app directory
mkdir -p /opt/youtube-summarizer
cd /opt/youtube-summarizer

# Clone repository
git clone https://github.com/AI-Empower-HQ-360/youtube-video-summar.git .

# Install dependencies
npm install

# Create systemd service for the app
cat > /etc/systemd/system/youtube-summarizer.service <<'EOF'
[Unit]
Description=YouTube Summarizer Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/youtube-summarizer
ExecStart=/opt/youtube-summarizer/start.sh
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
systemctl daemon-reload
systemctl enable youtube-summarizer.service
systemctl start youtube-summarizer.service

echo "YouTube Summarizer setup complete!"
echo "Access at: http://$(hostname -I | awk '{print $1}'):5173"
