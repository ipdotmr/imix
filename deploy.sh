#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== iMix CRM Deployment =====${NC}"

echo -e "${YELLOW}Setting up frontend environment...${NC}"
bash /home/ubuntu/whatsapp-business-platform/setup_frontend_env.sh
echo -e "${GREEN}✓${NC} Frontend environment setup complete"

echo -e "${YELLOW}Building frontend...${NC}"
cd /home/ubuntu/whatsapp-business-platform/frontend
npm run build
echo -e "${GREEN}✓${NC} Frontend build complete"

echo -e "${YELLOW}Deploying frontend...${NC}"
sudo rm -rf /www/wwwroot/imix/imix/frontend/dist/*
sudo cp -r /home/ubuntu/whatsapp-business-platform/frontend/dist/* /www/wwwroot/imix/imix/frontend/dist/
sudo cp /home/ubuntu/whatsapp-business-platform/frontend/.env /www/wwwroot/imix/imix/frontend/dist/
echo -e "${GREEN}✓${NC} Frontend deployment complete"

echo -e "${YELLOW}Setting up Nginx...${NC}"
bash /home/ubuntu/whatsapp-business-platform/setup_nginx.sh
echo -e "${GREEN}✓${NC} Nginx setup complete"

echo -e "${YELLOW}Setting up MongoDB sample data...${NC}"
bash /home/ubuntu/whatsapp-business-platform/backend/whatsapp_api/scripts/mongodb_export.sh
echo -e "${GREEN}✓${NC} MongoDB sample data setup complete"

echo -e "\n${GREEN}===== Deployment Complete =====${NC}"
echo -e "Please follow the verification guide to ensure everything is working correctly."
echo -e "Verification guide: ${GREEN}/home/ubuntu/whatsapp-business-platform/verification_guide.md${NC}"
