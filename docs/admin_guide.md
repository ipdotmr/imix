# iMix CRM by IPROD - Administrator Guide

## Table of Contents
1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Tenant Management](#tenant-management)
6. [User Management](#user-management)
7. [WhatsApp Account Configuration](#whatsapp-account-configuration)
8. [System Updates](#system-updates)
9. [Backup and Restore](#backup-and-restore)
10. [Troubleshooting](#troubleshooting)

## Introduction

iMix CRM by IPROD is a comprehensive WhatsApp Business API platform designed for resellers and agencies to manage multiple WhatsApp Business Accounts for their clients. This guide provides detailed instructions for administrators on how to install, configure, and manage the platform.

## System Requirements

### Server Requirements
- **Operating System**: Ubuntu 20.04 LTS or newer
- **CPU**: 4+ cores
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 50GB minimum, SSD recommended
- **Database**: MongoDB 4.4+
- **Redis**: Redis 6.0+
- **Node.js**: 16.x or newer
- **Python**: 3.9 or newer

### Network Requirements
- Public IP address or domain name
- HTTPS certificate
- Open ports: 80, 443, 27017 (MongoDB), 6379 (Redis)

## Installation

### Backend Installation

1. Clone the repository:
```bash
git clone https://github.com/ipdotmr/imix.git
cd imix/backend/whatsapp_api
```

2. Install dependencies:
```bash
poetry install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your configuration:
```
MONGODB_URI=mongodb://localhost:27017
DB_NAME=whatsapp_api
SECRET_KEY=your-secret-key-here
TOKEN_URL=/auth/token
ACCESS_TOKEN_EXPIRE_MINUTES=1440
UPDATE_SERVER_URL=https://updates.imix.ip.mr
```

5. Initialize the database:
```bash
poetry run python -m app.db.init_db
```

6. Start the backend server:
```bash
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Installation

1. Navigate to the frontend directory:
```bash
cd ../../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your configuration:
```
VITE_API_URL=http://localhost:8000
```

5. Build the frontend:
```bash
npm run build
```

6. Deploy the frontend:
```bash
# Using nginx
cp -r dist/* /var/www/html/
```

## Configuration

### Initial Setup

1. Access the admin panel at `https://your-domain.com/login`
2. Log in with the default admin credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Change the default password immediately after logging in

### SMTP Configuration

1. Navigate to Settings > Notifications
2. Configure the SMTP settings:
   - SMTP Server: Your SMTP server address
   - SMTP Port: Your SMTP server port (usually 587 for TLS)
   - SMTP Username: Your SMTP username
   - SMTP Password: Your SMTP password
   - From Email: The email address to send notifications from
   - From Name: The name to display in the email sender field
3. Test the configuration by sending a test email

### AI Assistant Configuration

1. Navigate to Settings > AI Assistant
2. Configure the ChatGPT provider:
   - API Key: Your OpenAI API key
   - Model: Select the model to use (e.g., gpt-4)
   - Temperature: Set the temperature for responses (0.0-1.0)
   - Max Tokens: Set the maximum tokens for responses
3. Configure the DeepSeek R1 provider:
   - API URL: `https://deep.ip.mr/api/v1`
   - API Key: Your DeepSeek API key
   - Model: Select the model to use
   - Temperature: Set the temperature for responses (0.0-1.0)
   - Max Tokens: Set the maximum tokens for responses

## Tenant Management

### Creating a New Tenant

1. Navigate to Tenants > Add Tenant
2. Fill in the tenant information:
   - Name: Tenant name
   - Organization: Organization name
   - Address: Physical address
   - Phone: Primary phone number
   - Mobile: Mobile phone number
   - Email: Primary email address
   - Private Notes: Internal notes about the tenant
   - Logo: Upload tenant logo
   - Documents: Upload relevant documents
3. Set the tenant's default language (English, French, or Arabic)
4. Configure usage limits:
   - Max Messages Per Day: Maximum number of messages the tenant can send per day
   - Max Media Per Day: Maximum number of media messages the tenant can send per day
   - Max Templates: Maximum number of message templates the tenant can create
   - Max Agents: Maximum number of agents the tenant can have
   - Max Contacts: Maximum number of contacts the tenant can have
   - Max Contact Groups: Maximum number of contact groups the tenant can create
5. Click "Create Tenant"

### Editing a Tenant

1. Navigate to Tenants
2. Find the tenant you want to edit and click the Edit button
3. Update the tenant information as needed
4. Click "Update Tenant"

### Deactivating a Tenant

1. Navigate to Tenants
2. Find the tenant you want to deactivate and click the Deactivate button
3. Confirm the deactivation

## User Management

### Creating a New User

1. Navigate to Settings > User Management
2. Click "Add User"
3. Fill in the user information:
   - Email: User's email address
   - First Name: User's first name
   - Last Name: User's last name
   - Role: Select the user's role (Admin, Manager, Agent, Supervisor, ReadOnly, Billing, Custom)
   - Tenant: Select the tenant the user belongs to
   - Default Language: Select the user's default language
4. Click "Create User"
5. The user will receive an email with instructions to set their password

### Editing a User

1. Navigate to Settings > User Management
2. Find the user you want to edit and click the Edit button
3. Update the user information as needed
4. Click "Update User"

### Deactivating a User

1. Navigate to Settings > User Management
2. Find the user you want to deactivate and click the Deactivate button
3. Confirm the deactivation

## WhatsApp Account Configuration

### Adding a WhatsApp Account

1. Navigate to Tenants
2. Select the tenant you want to add a WhatsApp account for
3. Go to the "WhatsApp Accounts" tab
4. Click "Add WhatsApp Account"
5. Fill in the account information:
   - WhatsApp Business Account ID: Your WhatsApp Business Account ID from Meta
   - Business Account ID: Your Business Account ID from Meta
   - Meta Access Token: Your Meta access token
   - WhatsApp Phone ID: Your WhatsApp Phone ID
   - App ID: Your App ID
   - Display Phone Number: The phone number to display to users
   - Business Name: The business name to display to users
6. Configure the webhook settings:
   - Webhook URI: The URI to receive webhook events
   - Webhook Token: The token to verify webhook events
7. Click "Add Account"

### Editing a WhatsApp Account

1. Navigate to Tenants
2. Select the tenant with the WhatsApp account you want to edit
3. Go to the "WhatsApp Accounts" tab
4. Find the account you want to edit and click the Edit button
5. Update the account information as needed
6. Click "Update Account"

### Verifying a WhatsApp Account

1. Navigate to Tenants
2. Select the tenant with the WhatsApp account you want to verify
3. Go to the "WhatsApp Accounts" tab
4. Find the account you want to verify and click the Verify button
5. Follow the verification process provided by Meta

## System Updates

### Checking for Updates

1. Navigate to Settings > System Update
2. Click "Check for Updates"
3. If an update is available, you will see the new version information and release notes

### Installing an Update

1. Navigate to Settings > System Update
2. Click "Check for Updates"
3. If an update is available, click "Install Update"
4. Confirm the installation
5. The system will create a backup, download the update, and install it
6. The page will refresh when the update is complete

### Managing Backups

1. Navigate to Settings > System Update
2. Scroll down to the "System Backups" section
3. You will see a list of available backups with their version, timestamp, and size
4. To restore from a backup, click the "Restore" button next to the backup
5. Confirm the restoration
6. The system will restore from the backup and refresh when complete

## Backup and Restore

### Creating a Manual Backup

1. Navigate to Settings > System Update
2. Click "Create Backup"
3. The system will create a backup of the current version
4. The backup will appear in the "System Backups" list

### Restoring from a Backup

1. Navigate to Settings > System Update
2. Scroll down to the "System Backups" section
3. Find the backup you want to restore from and click the "Restore" button
4. Confirm the restoration
5. The system will restore from the backup and refresh when complete

### Downloading a Backup

1. Navigate to Settings > System Update
2. Scroll down to the "System Backups" section
3. Find the backup you want to download and click the "Download" button
4. The backup will be downloaded to your computer

## Troubleshooting

### Common Issues

#### Backend Server Not Starting

1. Check the MongoDB connection:
```bash
mongo --eval "db.runCommand({ ping: 1 })"
```

2. Check the Redis connection:
```bash
redis-cli ping
```

3. Check the logs:
```bash
tail -f /var/log/imix/backend.log
```

#### Frontend Not Loading

1. Check the nginx configuration:
```bash
nginx -t
```

2. Check the nginx logs:
```bash
tail -f /var/log/nginx/error.log
```

3. Check the browser console for errors

#### WhatsApp API Connection Issues

1. Verify the WhatsApp Business API credentials
2. Check the webhook configuration
3. Check the logs for API errors:
```bash
tail -f /var/log/imix/whatsapp.log
```

### Getting Support

If you encounter issues that you cannot resolve, please contact our support team:

- Email: support@iprod.mr
- Phone: +123-456-7890
- Website: https://imix.ip.mr/support
