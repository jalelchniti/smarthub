#!/bin/bash
# SmartHub Webhook Deployment Setup Script
# This script helps upload the webhook deployment script to OVH server

echo "🚀 SmartHub Webhook Deployment Setup"
echo "===================================="

# Configuration
WEBHOOK_FILE="webhook-deploy.php"
SERVER="ssh.cluster100.hosting.ovh.net"
USER="fohaixl"
REMOTE_PATH="/home/fohaixl/www/smarthub"

echo "📋 Configuration:"
echo "  Server: $SERVER"
echo "  User: $USER"
echo "  Remote path: $REMOTE_PATH"
echo "  Webhook file: $WEBHOOK_FILE"
echo ""

# Check if webhook file exists
if [ ! -f "$WEBHOOK_FILE" ]; then
    echo "❌ Error: $WEBHOOK_FILE not found in current directory"
    exit 1
fi

echo "📤 Uploading webhook deployment script..."

# Upload the webhook script
if scp -P 22 "$WEBHOOK_FILE" "$USER@$SERVER:$REMOTE_PATH/"; then
    echo "✅ Webhook script uploaded successfully"
else
    echo "❌ Upload failed. Please check your SSH credentials"
    exit 1
fi

echo "🔧 Setting permissions..."

# Set proper permissions via SSH
if ssh -p 22 "$USER@$SERVER" "chmod 755 $REMOTE_PATH/$WEBHOOK_FILE"; then
    echo "✅ Permissions set successfully"
else
    echo "⚠️  Permission setting failed (script may still work)"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📍 Webhook URL: http://fohaixl.cluster100.hosting.ovh.net/smarthub/$WEBHOOK_FILE"
echo "🔗 Test URL: http://fohaixl.cluster100.hosting.ovh.net/smarthub/$WEBHOOK_FILE"
echo ""
echo "📋 Next steps:"
echo "1. Test the webhook endpoint by visiting the test URL"
echo "2. Push a commit to your GitHub repository"
echo "3. Check deployment logs on your server"
echo ""
echo "🔍 To check deployment logs:"
echo "   ssh $USER@$SERVER -p 22"
echo "   tail -f $REMOTE_PATH/deploy.log"