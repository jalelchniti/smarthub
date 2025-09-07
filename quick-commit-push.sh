#!/bin/bash
# Quick commit and push script for testing webhook deployment

echo "🔄 SmartHub - Quick Commit & Push"
echo "================================="

# Check for uncommitted changes
if [ -z "$(git status --porcelain)" ]; then
    echo "📝 No changes to commit. Making a test change..."
    
    # Update README with timestamp for testing
    echo -e "\n<!-- Last updated: $(date) -->" >> README.md
    echo "✅ Added timestamp to README.md"
fi

echo "📋 Current status:"
git status --short

echo ""
echo "📤 Staging changes..."
git add -A

echo "💬 Creating commit..."
git commit -m "feat: update deployment with webhook automation

🤖 Automated deployment setup:
- Added webhook-deploy.php for GitHub integration
- Configured automatic build and deploy process
- Updated repository to u-smart-net

Deployment triggered: $(date)"

echo "🚀 Pushing to GitHub (this will trigger deployment)..."
if git push origin master; then
    echo ""
    echo "✅ Push successful!"
    echo ""
    echo "🔄 Webhook should trigger deployment now..."
    echo "📍 Check deployment status at:"
    echo "   http://fohaixl.cluster100.hosting.ovh.net/smarthub/webhook-deploy.php"
    echo ""
    echo "🌐 Live site should update at:"
    echo "   http://fohaixl.cluster100.hosting.ovh.net/smarthub/"
else
    echo "❌ Push failed. Please check your GitHub credentials"
    exit 1
fi