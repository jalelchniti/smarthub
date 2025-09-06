#!/bin/bash
# SmartHub OVH SSH Connection Script
# Connects to OVH hosting server for manual deployment and maintenance tasks

echo "🔌 Connecting to SmartHub OVH hosting server..."

# Server configuration  
HOST="ssh.cluster100.hosting.ovh.net"
PORT="22"
USER="fohaixl"

echo "📡 Connecting to $USER@$HOST:$PORT"
echo "💡 Common tasks after connecting:"
echo "   - cd /www/smarthub"
echo "   - ls -la (check files)"
echo "   - chmod 755 api.cgi (fix backend permissions)"
echo "   - curl localhost/smarthub/api.cgi?endpoint=status (test backend)"
echo "   - npm install mysql2 bcryptjs jsonwebtoken (install dependencies)"
echo ""
echo "🔑 Password will be prompted by SSH..."

# Connect via SSH (password will be prompted)
ssh -p $PORT $USER@$HOST