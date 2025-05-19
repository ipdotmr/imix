# iMix CRM Verification Guide

This guide provides steps to verify that all the fixes have been implemented correctly.

## 1. Settings Navigation

1. Log in to the application
2. Navigate to Settings
3. Verify that there is a back button in the top-left corner
4. Click the back button and verify that it takes you back to the dashboard

## 2. Tenant Functionality

1. Navigate to the Tenants page
2. Verify that each tenant has a "View" button (eye icon)
3. Click the "View" button for a tenant
4. Verify that a dialog opens showing the tenant details
5. Verify that you can see the tenant's basic information, WhatsApp accounts, and private notes

## 3. Translation Placeholders

1. Change the language to English, French, and Arabic using the language selector
2. Navigate to the Tenants page
3. Verify that all text is properly translated (no placeholders like "tenants.title")
4. Check other pages to ensure translations are working correctly

## 4. Flow Designer

1. Navigate to the Flow Designer
2. Create a new flow with triggers, conditions, and actions
3. Save the flow and verify that it appears in the dropdown
4. Select a saved flow from the dropdown and verify that it loads correctly
5. Make changes to the flow and save again
6. Verify that the changes are preserved when you reload the flow

## 5. API Connectivity

1. Check the browser console for any API connection errors
2. Verify that the frontend is connecting to the correct API endpoint (https://apimix.ip.mr)
3. Check that data is being loaded from the API

## 6. Nginx Configuration

1. Access the application at https://imix.ip.mr
2. Navigate between pages and verify that client-side routing works correctly
3. Refresh the page on a non-root route and verify that it loads correctly
4. Access the API at https://apimix.ip.mr/healthz and verify that it returns a 200 OK response

## 7. MongoDB Sample Data

1. Log in with the sample user credentials (admin@example.com / password123)
2. Verify that sample tenants, users, contacts, and flows are displayed
3. Check that you can interact with the sample data
