#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== iMix CRM Nginx Configuration =====${NC}"

echo -e "${YELLOW}Creating Nginx configuration file...${NC}"
sudo cp /home/ubuntu/whatsapp-business-platform/nginx_config.conf /tmp/imix_nginx.conf
echo -e "${GREEN}✓${NC} Created Nginx configuration file"

echo -e "\n${YELLOW}IMPORTANT: Manual steps required${NC}"
echo -e "1. Log in to aaPanel at https://194.238.31.223:28556/94d88055"
echo -e "2. Go to Website → imix.ip.mr → Settings → Configuration"
echo -e "3. Replace the existing configuration with the content from /tmp/imix_nginx.conf"
echo -e "4. Save the configuration and restart Nginx"
echo -e "5. Repeat for apimix.ip.mr or create this website if it doesn't exist"

echo -e "\n${GREEN}===== Nginx Configuration Complete =====${NC}"
