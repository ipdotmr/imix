#!/bin/bash

set -e  # Exit on any error

echo "===== Deploying iMix CRM Platform Fixes ====="

echo "Deploying translation fix script..."
sudo cp /home/ubuntu/whatsapp-business-platform/translation_fix.js /www/wwwroot/imix/imix/frontend/dist/translation_fix.js
sudo chmod 644 /www/wwwroot/imix/imix/frontend/dist/translation_fix.js

echo "Updating index.html..."
sudo cp /www/wwwroot/imix/imix/frontend/dist/index.html /www/wwwroot/imix/imix/frontend/dist/index.html.bak
sudo sed -i '/<\/body>/i \    <script src="\/translation_fix.js"><\/script>' /www/wwwroot/imix/imix/frontend/dist/index.html

echo "Creating .htaccess file for SPA routing..."
sudo bash -c 'cat > /www/wwwroot/imix/imix/frontend/dist/.htaccess << EOF
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
EOF'
sudo chmod 644 /www/wwwroot/imix/imix/frontend/dist/.htaccess

echo "Setting up backend service..."
sudo bash -c 'cat > /etc/systemd/system/whatsapp-api.service << EOF
[Unit]
Description=WhatsApp Business API Service
After=network.target mongodb.service

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/whatsapp-business-platform/backend/whatsapp_api
ExecStart=/usr/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=whatsapp-api
Environment=PYTHONPATH=/home/ubuntu/whatsapp-business-platform/backend/whatsapp_api

[Install]
WantedBy=multi-user.target
EOF'

echo "Creating .env file for the backend..."
mkdir -p /home/ubuntu/whatsapp-business-platform/backend/whatsapp_api
cat > /home/ubuntu/whatsapp-business-platform/backend/whatsapp_api/.env << EOF
MONGODB_URI=mongodb://localhost:27017
DB_NAME=imix_crm
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=1440
WHATSAPP_API_BASE_URL=https://graph.facebook.com/v16.0
API_URL=https://apimix.ip.mr
FRONTEND_URL=https://imix.ip.mr
EOF

echo "Setting up Nginx configuration for the API..."
sudo bash -c 'cat > /etc/nginx/sites-available/apimix.ip.mr.conf << EOF
server {
    listen 80;
    server_name apimix.ip.mr;

    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF'

sudo ln -sf /etc/nginx/sites-available/apimix.ip.mr.conf /etc/nginx/sites-enabled/

echo "Populating MongoDB with real data..."
mongosh < /home/ubuntu/whatsapp-business-platform/backend/whatsapp_api/scripts/generate_real_data.js

echo "Starting WhatsApp API service..."
sudo systemctl daemon-reload
sudo systemctl restart whatsapp-api || sudo systemctl start whatsapp-api
sudo systemctl enable whatsapp-api

echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "===== Deployment Complete ====="
echo "Frontend: https://imix.ip.mr"
echo "API: https://apimix.ip.mr"
echo "Default login: admin@example.com / password123"
