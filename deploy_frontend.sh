#!/bin/bash
# SmartHub Frontend Deployment Script
# Usage: ./deploy_frontend.sh
# Prerequisites: SSH key configured or password will be prompted

echo "🚀 Starting SmartHub frontend deployment..."

# Server configuration
HOST="ssh.cluster100.hosting.ovh.net"
PORT="22"
USER="fohaixl"
REMOTE_PATH="/www/smarthub"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist/ directory not found. Please run 'npm run build' first."
    exit 1
fi

echo "📦 Uploading frontend files..."

# Upload files using SCP
if scp -P $PORT -r dist/* ${USER}@${HOST}:${REMOTE_PATH}/; then
    echo "✅ Files uploaded successfully"
else
    echo "❌ Upload failed. Check your SSH credentials."
    exit 1
fi

echo "🔧 Setting file permissions..."

# Set appropriate permissions
if ssh -p $PORT ${USER}@${HOST} "cd ${REMOTE_PATH} && find . -type f -name '*.html' -exec chmod 644 {} \; && find . -type f -name '*.js' -exec chmod 644 {} \; && find . -type f -name '*.css' -exec chmod 644 {} \; && find . -type d -exec chmod 755 {} \;"; then
    echo "✅ Permissions set successfully"
else
    echo "⚠️  Permission setting failed (deployment may still work)"
fi

echo "🎉 Deployment completed!"
echo "🌐 Visit: http://fohaixl.cluster100.hosting.ovh.net/smarthub/"