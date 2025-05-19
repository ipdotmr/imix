# iMix CRM Deployment Guide

This guide provides detailed instructions for deploying the iMix CRM platform on an aaPanel server.

## Prerequisites

- aaPanel installed on your server
- Access to Cloudflare DNS (or your DNS provider)
- Root access to the server

## 1. Server Preparation

### 1.1 Install Required Packages

```bash
# Update package lists
apt update

# Install MongoDB
apt install -y mongodb
systemctl start mongodb
systemctl enable mongodb

# Install Python dependencies
apt install -y python3-pip
pip3 install poetry
```

## 2. Project Setup

### 2.1 Create Project Directories

```bash
# Create project directories
mkdir -p /www/wwwroot/imix/imix/backend/whatsapp_api
mkdir -p /www/wwwroot/imix/imix/frontend/dist
```

### 2.2 Clone Repository (Optional)

If you want to clone the repository directly:

```bash
cd /www/wwwroot/imix
git clone https://github.com/ipdotmr/imix.git
```

### 2.3 Copy Project Files

If you already have the project files, copy them to the appropriate directories:

```bash
# Copy backend files
cp -r /path/to/backend/* /www/wwwroot/imix/imix/backend/

# Copy frontend files
cp -r /path/to/frontend/dist/* /www/wwwroot/imix/imix/frontend/dist/
```

## 3. Backend Configuration

### 3.1 Install Python Dependencies

```bash
cd /www/wwwroot/imix/imix/backend/whatsapp_api
poetry install
poetry add python-jose python-multipart fastapi-users[beanie] passlib pydantic-settings
```

### 3.2 Create Environment File

```bash
cd /www/wwwroot/imix/imix/backend/whatsapp_api
cat > .env << 'EOF'
app_name="iMix CRM by IPROD"
mongodb_uri="mongodb://localhost:27017"
db_name="whatsapp_api"
secret_key="$(openssl rand -hex 32)"
token_url="/auth/token"
access_token_expire_minutes=1440
update_server_url="https://updates.imix.ip.mr"
EOF
```

### 3.3 Configure Supervisor

```bash
# Create Supervisor configuration
mkdir -p /etc/supervisor/conf.d/
cat > /etc/supervisor/conf.d/imix.conf << 'EOF'
[program:imix-backend]
command=/usr/local/bin/poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000
directory=/www/wwwroot/imix/imix/backend/whatsapp_api
autostart=true
autorestart=true
stderr_logfile=/var/log/imix-backend.err.log
stdout_logfile=/var/log/imix-backend.out.log
user=root
EOF

# Reload Supervisor configuration
supervisorctl reread
supervisorctl update
supervisorctl restart imix-backend
```

## 4. Frontend Configuration

### 4.1 Create Placeholder Frontend

If you don't have a built frontend, create a placeholder:

```bash
cat > /www/wwwroot/imix/imix/frontend/dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iMix CRM by IPROD</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #6e8efb, #a777e3);
      color: white;
      text-align: center;
    }
    .container {
      max-width: 600px;
      padding: 2rem;
      border-radius: 8px;
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    h1 {
      margin-bottom: 1rem;
    }
    p {
      margin-bottom: 2rem;
    }
    .logo {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">📱</div>
    <h1>iMix CRM by IPROD</h1>
    <p>WhatsApp Business API Platform</p>
    <p>Coming Soon</p>
  </div>
</body>
</html>
EOF
```

## 5. aaPanel Website Configuration

### 5.1 Frontend Website (imix.ip.mr)

1. Log in to aaPanel
2. Go to "Website" → "Add site"
3. Enter domain: `imix.ip.mr`
4. Set document root: `/www/wwwroot/imix/imix/frontend/dist`
5. Select PHP version (if needed)
6. Click "Submit"

### 5.2 API Website (api.imix.ip.mr)

1. Go to "Website" → "Add site"
2. Enter domain: `api.imix.ip.mr`
3. Set document root to any directory (will be overridden by proxy)
4. After creating the site, go to "Site Settings" → "Proxy"
5. Add a new proxy rule:
   - Name: `api`
   - Target URL: `http://localhost:8000`
   - Click "Save"

## 6. DNS and SSL Configuration

### 6.1 Configure DNS Records

1. Log in to your Cloudflare account
2. Add A records for both domains pointing to your server's IP address:
   - `imix.ip.mr` → Your server IP
   - `api.imix.ip.mr` → Your server IP

### 6.2 Configure Cloudflare SSL

1. In Cloudflare, go to SSL/TLS section
2. Set SSL/TLS encryption mode to "Full"
3. Ensure SSL is enabled for both domains

### 6.3 Set Up SSL Certificates in aaPanel

1. Go to "Website" → Select your domain
2. Click "SSL"
3. Select "Let's Encrypt"
4. Choose domains to secure
5. Click "Apply"

## 7. Verification

### 7.1 Check Backend Service

```bash
# Check if the backend service is running
supervisorctl status imix-backend

# Check the logs for errors
cat /var/log/imix-backend.err.log
cat /var/log/imix-backend.out.log
```

### 7.2 Test API Endpoint

```bash
# Test the API endpoint
curl -L https://api.imix.ip.mr/healthz
# Should return {"status":"ok"}
```

### 7.3 Verify Frontend

Access the frontend in a browser:
- Visit `https://imix.ip.mr`

## 8. Troubleshooting

### 8.1 MongoDB Issues

```bash
# Check MongoDB status
systemctl status mongodb

# View MongoDB logs
journalctl -u mongodb
```

### 8.2 Backend Service Issues

```bash
# Check Supervisor configuration
cat /etc/supervisor/conf.d/imix.conf

# View backend logs
cat /var/log/imix-backend.err.log
cat /var/log/imix-backend.out.log
```

### 8.3 SSL Certificate Issues

1. Ensure DNS records are properly configured and propagated
2. Check Cloudflare SSL settings (should be set to "Full")
3. Verify SSL certificate installation in aaPanel

### 8.4 API Accessibility Issues

```bash
# Check if the service is running
supervisorctl status imix-backend

# Check if the port is open
netstat -tulpn | grep 8000

# Check proxy configuration in aaPanel
```

## 9. Maintenance

### 9.1 Updating the Application

1. Pull the latest changes from the repository
2. Rebuild the frontend (if needed)
3. Restart the backend service:
   ```bash
   supervisorctl restart imix-backend
   ```

### 9.2 Backup and Restore

1. Backup MongoDB data:
   ```bash
   mongodump --out /path/to/backup
   ```

2. Restore MongoDB data:
   ```bash
   mongorestore /path/to/backup
   ```

## 10. Contact and Support

For assistance with deployment or other issues, contact:
- Email: support@iprod.mr
- Website: https://iprod.mr
