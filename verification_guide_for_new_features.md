# Verification Guide for New Features

## 1. Webhook Auto-generation and Token Regeneration

### How to Verify:
1. Log in to the iMix CRM platform at https://imix.ip.mr
2. Navigate to Tenants and click "Add Tenant"
3. Fill in the required fields and create the tenant
4. Go to the "Webhook Settings" tab
5. Verify that:
   - The webhook URI field is read-only and shows "Auto-generated after creation"
   - The webhook token field is read-only and shows "Auto-generated after creation"
6. Save the tenant and then edit it again
7. Go to the "Webhook Settings" tab
8. Verify that:
   - The webhook URI field is populated with an auto-generated URI
   - The webhook token field is populated with an auto-generated token
   - There is a "Regenerate Token" button next to the token field
9. Click the "Regenerate Token" button
10. Verify that a new token is generated and a confirmation message appears

## 2. Meta-compatible WhatsApp Configuration Fields

### How to Verify:
1. Navigate to Tenants and edit an existing tenant
2. Go to the "WhatsApp Accounts" tab and click "Add Account"
3. Verify that the following Meta-required fields are present:
   - Business Name
   - Phone Number
   - Business Account ID
   - Meta Access Token
   - WhatsApp Phone ID
   - App ID
4. Fill in the fields with valid data and save
5. Verify that the account is created successfully

## 3. Chat Labeling Functionality

### How to Verify:
1. Navigate to the "Labels" section in the sidebar
2. Verify that you can:
   - Create new labels with custom names and colors
   - Edit existing labels
   - Delete labels
3. Navigate to the Agent Workspace
4. Open a conversation with a contact
5. Verify that:
   - You can see existing labels for the conversation
   - You can add new labels to the conversation by clicking the "Add Label" button
   - You can remove labels from the conversation by clicking the "×" on a label
6. Create labels with different colors and verify they display correctly
7. Test label functionality as both admin and tenant users

## 4. iOS Mobile App

### How to Build and Test:
1. Open the iOS project in Xcode:
   ```
   cd /home/ubuntu/whatsapp-business-platform/ios-app/WhatsAppCompanion
   open WhatsAppCompanion.xcodeproj
   ```
2. Build and run the app on a simulator or device
3. Verify the login screen:
   - Email and password fields
   - Login button
   - iMix CRM branding
4. Log in with valid credentials
5. Verify the WhatsApp-like UI:
   - Chats tab with conversation list
   - Contacts tab with contact list
   - Settings tab with user profile and options
6. Test the additional features:
   - Chat assignment
   - Labeling (adding/removing labels)
   - Private notes (visible only to agents/tenants)
   - Quick replies (triggered by typing // in chat)
   - Block and archive functionality

## 5. Deployment Verification

### How to Deploy and Verify:
1. Run the deployment script:
   ```
   cd /home/ubuntu/whatsapp-business-platform
   bash deploy.sh
   ```
2. Verify that the frontend is built and deployed successfully
3. Access the application at https://imix.ip.mr
4. Test all the features mentioned above in the production environment
5. Verify that the API endpoint at https://apimix.ip.mr is working correctly

## Troubleshooting

If you encounter any issues during verification:
1. Check the browser console for frontend errors
2. Check the server logs for backend errors:
   ```
   sudo tail -f /var/log/whatsapp-api.log
   ```
3. Verify that the MongoDB database is running:
   ```
   mongo mongodb://localhost:27017/imix_crm --eval "db.stats()"
   ```
4. Restart the backend service if needed:
   ```
   sudo systemctl restart whatsapp-api
   ```

All features have been implemented according to the requirements and should be working correctly. If you encounter any issues or have questions, please let me know.
