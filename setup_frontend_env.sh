#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== iMix CRM Frontend Environment Setup =====${NC}"

echo -e "${YELLOW}Setting up frontend .env file...${NC}"
mkdir -p /home/ubuntu/whatsapp-business-platform/frontend
cat > /home/ubuntu/whatsapp-business-platform/frontend/.env << 'EOF'
VITE_API_URL=https://apimix.ip.mr
EOF
echo -e "${GREEN}✓${NC} Created .env file in development directory"

echo -e "${YELLOW}Setting up production .env file...${NC}"
sudo mkdir -p /www/wwwroot/imix/imix/frontend/dist
sudo bash -c 'cat > /www/wwwroot/imix/imix/frontend/dist/.env << EOF
VITE_API_URL=https://apimix.ip.mr
EOF'
echo -e "${GREEN}✓${NC} Created .env file in production directory"

echo -e "\n${GREEN}===== Frontend Environment Setup Complete =====${NC}"
echo -e "The frontend will now use API endpoint: ${GREEN}https://apimix.ip.mr${NC}"
