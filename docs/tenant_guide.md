# iMix CRM by IPROD - Tenant Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard Overview](#dashboard-overview)
4. [WhatsApp Account Management](#whatsapp-account-management)
5. [Agent Management](#agent-management)
6. [Contact Management](#contact-management)
7. [Message Templates](#message-templates)
8. [Flow Designer](#flow-designer)
9. [AI Assistant](#ai-assistant)
10. [Reports and Analytics](#reports-and-analytics)
11. [Settings](#settings)
12. [Troubleshooting](#troubleshooting)

## Introduction

Welcome to iMix CRM by IPROD, a comprehensive WhatsApp Business API platform designed to help you manage your WhatsApp Business Accounts, engage with your customers, and automate your messaging workflows. This guide will help you understand how to use the platform effectively as a tenant.

## Getting Started

### Logging In

1. Access the platform at `https://imix.ip.mr/login`
2. Enter your email address and password
3. Click "Log In"

### First-Time Setup

After logging in for the first time, you should:

1. Update your profile information
2. Configure your WhatsApp Business Account
3. Set up your team by inviting agents
4. Create message templates
5. Configure your AI assistant

## Dashboard Overview

The dashboard provides an overview of your WhatsApp Business Account activity, including:

- Active conversations
- Messages sent and received
- Agent performance
- Customer satisfaction metrics
- Recent activities

### Navigation

The main navigation menu includes:

- **Dashboard**: Overview of your account activity
- **Conversations**: View and manage customer conversations
- **Contacts**: Manage your contacts and groups
- **Templates**: Create and manage message templates
- **Flows**: Design automated conversation flows
- **Tasks**: Manage tasks assigned to agents
- **Reports**: View detailed analytics and reports
- **Settings**: Configure your account settings

## WhatsApp Account Management

### Configuring Your WhatsApp Business Account

1. Navigate to Settings > WhatsApp Accounts
2. Click "Add WhatsApp Account" or select an existing account to edit
3. Enter the required information:
   - WhatsApp Business Account ID
   - Business Account ID
   - Meta Access Token
   - WhatsApp Phone ID
   - App ID
   - Display Phone Number
   - Business Name
4. Configure your webhook settings:
   - Webhook URI
   - Webhook Token
5. Click "Save"

### Verifying Your WhatsApp Business Account

1. Navigate to Settings > WhatsApp Accounts
2. Select the account you want to verify
3. Click "Verify Account"
4. Follow the verification process provided by Meta

## Agent Management

### Inviting Agents

1. Navigate to Settings > User Management
2. Click "Invite User"
3. Enter the agent's email address
4. Select the role (Agent, Supervisor, etc.)
5. Set the agent's default language
6. Click "Send Invitation"

### Managing Agent Roles and Permissions

1. Navigate to Settings > User Management
2. Find the agent you want to manage
3. Click "Edit"
4. Update the agent's role and permissions
5. Click "Save"

### Assigning Conversations to Agents

1. Navigate to Conversations
2. Select the conversation you want to assign
3. Click "Assign"
4. Select the agent from the dropdown
5. Click "Assign"

## Contact Management

### Creating Contact Groups

1. Navigate to Contacts > Phone Book
2. Click "Add Group"
3. Enter the group name and description
4. Configure role permissions for the group
5. Click "Create Group"

### Adding Variant Fields to Groups

1. Navigate to Contacts > Phone Book
2. Select the group you want to edit
3. Click "Variant Fields"
4. Add new variant fields with the following information:
   - Field Name
   - Field Description
   - Visible to Agent (maximum 3)
   - Available in Flows
5. Click "Done"

### Adding Contacts to Groups

1. Navigate to Contacts > Phone Book
2. Select the group you want to add contacts to
3. Click "Add Contacts"
4. Search for contacts or select from the list
5. Click "Add Selected Contacts"

### Importing Contacts

1. Navigate to Contacts
2. Click "Import Contacts"
3. Select the file format (CSV, Excel)
4. Upload your file
5. Map the columns to the contact fields
6. Click "Import"

## Message Templates

### Creating Message Templates

1. Navigate to Templates
2. Click "Create Template"
3. Select the template type (Text, Media, Interactive)
4. Enter the template content
5. Add variables using the `{{variable}}` syntax
6. Preview the template
7. Click "Save Template"

### Submitting Templates for Approval

1. Navigate to Templates
2. Select the template you want to submit
3. Click "Submit for Approval"
4. Provide any additional information required by Meta
5. Click "Submit"

### Using Templates in Conversations

1. Navigate to Conversations
2. Select a conversation
3. Click the template icon in the message composer
4. Select the template you want to use
5. Fill in any variables
6. Click "Send"

## Flow Designer

### Creating a Flow

1. Navigate to Flows
2. Click "Create Flow"
3. Enter a name and description for the flow
4. Add triggers, conditions, and actions to the flow
5. Connect the nodes to create the flow logic
6. Click "Save Flow"

### Using Variant Fields in Flows

1. In the Flow Designer, add a condition node
2. Select "Variant Field" as the condition type
3. Select the variant field from the dropdown
4. Set the condition (equals, contains, etc.)
5. Enter the value to compare against
6. Connect the node to the appropriate next steps

### Testing a Flow

1. Navigate to Flows
2. Select the flow you want to test
3. Click "Test Flow"
4. Enter test values for any variables
5. Click "Run Test"
6. View the test results

### Activating a Flow

1. Navigate to Flows
2. Select the flow you want to activate
3. Toggle the "Active" switch
4. Confirm the activation

## AI Assistant

### Configuring the AI Assistant

1. Navigate to Settings > AI Assistant
2. Select the AI provider (ChatGPT or DeepSeek R1)
3. Configure the settings:
   - API Key (for ChatGPT)
   - Model
   - Temperature
   - Max Tokens
4. Click "Save"

### Training the AI Assistant

1. Navigate to Settings > AI Assistant
2. Click "Training Data"
3. Upload historical conversations or knowledge base documents
4. Map the data fields
5. Click "Train AI"

### Using the AI Assistant in Conversations

1. Navigate to Conversations
2. Select a conversation
3. Type your message or click the AI icon
4. The AI will suggest responses based on the context
5. Select a suggestion or edit it
6. Click "Send"

## Reports and Analytics

### Viewing Message Analytics

1. Navigate to Reports > Message Analytics
2. Select the date range
3. View metrics such as:
   - Messages sent and received
   - Message types
   - Response times
   - Conversation duration
4. Export the report as CSV or PDF

### Viewing Agent Performance

1. Navigate to Reports > Agent Performance
2. Select the date range and agents
3. View metrics such as:
   - Conversations handled
   - Messages sent
   - Average response time
   - Customer satisfaction ratings
4. Export the report as CSV or PDF

### Viewing Cost Reports

1. Navigate to Reports > Cost Reports
2. Select the date range
3. View metrics such as:
   - Total cost
   - Cost by message type
   - Cost by agent
   - Cost by conversation
4. Export the report as CSV or PDF

## Settings

### Branding Settings

1. Navigate to Settings > Branding
2. Customize your branding:
   - Company Name
   - Logo
   - Colors
   - Font
3. Click "Save"

### Notification Settings

1. Navigate to Settings > Notifications
2. Configure email notifications:
   - New message notifications
   - Assignment notifications
   - Task notifications
3. Configure sound notifications:
   - Enable/disable sounds
   - Select sound for new messages
   - Select sound for assignments
4. Click "Save"

### Localization Settings

1. Navigate to Settings > Localization
2. Select your default language (English, French, or Arabic)
3. Configure date and time formats
4. Configure number formats
5. Click "Save"

## Troubleshooting

### Common Issues

#### WhatsApp Connection Issues

1. Check your WhatsApp Business API credentials
2. Verify your webhook configuration
3. Check your internet connection
4. Contact support if the issue persists

#### Message Delivery Issues

1. Check if your template has been approved
2. Verify that the recipient's phone number is correct
3. Check if the recipient has blocked your number
4. Contact support if the issue persists

#### Agent Access Issues

1. Verify that the agent has been invited and has accepted the invitation
2. Check the agent's role and permissions
3. Have the agent clear their browser cache and cookies
4. Contact support if the issue persists

### Getting Support

If you encounter issues that you cannot resolve, please contact our support team:

- Email: support@iprod.mr
- Phone: +123-456-7890
- Website: https://imix.ip.mr/support
