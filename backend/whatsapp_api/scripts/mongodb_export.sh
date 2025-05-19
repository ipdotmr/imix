#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

DB_NAME="imix_crm"
EXPORT_DIR="/tmp/imix_crm_export"
DATE=$(date +"%Y%m%d_%H%M%S")
ARCHIVE_NAME="imix_crm_export_${DATE}.tar.gz"

echo -e "${GREEN}===== iMix CRM MongoDB Export =====${NC}"

if ! command -v mongod &> /dev/null; then
    echo -e "${RED}MongoDB is not installed. Please install MongoDB first.${NC}"
    exit 1
fi

echo -e "${YELLOW}Creating export directory...${NC}"
mkdir -p $EXPORT_DIR
echo -e "${GREEN}✓${NC} Created export directory"

echo -e "${YELLOW}Generating sample data...${NC}"
mongo mongodb://localhost:27017/$DB_NAME /home/ubuntu/whatsapp-business-platform/backend/whatsapp_api/scripts/generate_sample_data.js
echo -e "${GREEN}✓${NC} Generated sample data"

echo -e "${YELLOW}Exporting MongoDB database...${NC}"
mongodump --db $DB_NAME --out $EXPORT_DIR
echo -e "${GREEN}✓${NC} Exported MongoDB database"

echo -e "${YELLOW}Creating archive...${NC}"
tar -czf /tmp/$ARCHIVE_NAME -C $EXPORT_DIR .
echo -e "${GREEN}✓${NC} Created archive at /tmp/$ARCHIVE_NAME"

echo -e "${YELLOW}Cleaning up...${NC}"
rm -rf $EXPORT_DIR
echo -e "${GREEN}✓${NC} Cleaned up temporary files"

echo -e "\n${GREEN}===== MongoDB Export Complete =====${NC}"
echo -e "Archive created at: ${GREEN}/tmp/$ARCHIVE_NAME${NC}"
echo -e "\nTo import this data, run:"
echo -e "  1. Extract the archive: ${YELLOW}tar -xzf $ARCHIVE_NAME -C /tmp${NC}"
echo -e "  2. Import the data: ${YELLOW}mongorestore --db imix_crm /tmp/$DB_NAME${NC}"
