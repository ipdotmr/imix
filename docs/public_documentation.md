# iMix CRM by IPROD - WhatsApp Business API Platform

## Overview

iMix CRM by IPROD is a comprehensive WhatsApp Business API platform designed for resellers and agencies to manage multiple WhatsApp Business Accounts for their clients. This cloud-native, multi-tenant solution provides a complete ecosystem for WhatsApp business communication, including a powerful web dashboard, agent workspace, iOS companion app, and AI-powered assistant.

## Key Features

### Multi-Tenant Cloud API

- **Secure RESTful API**: Comprehensive API endpoints for all WhatsApp Business operations
- **Webhook Integration**: Real-time event notifications for inbound messages and delivery receipts
- **Role-Based Access Control**: Granular permissions for Admin, Manager, Agent, and custom roles
- **Rate Limiting & Throttling**: Configurable usage limits per tenant
- **Multi-Language Support**: Full support for English, French, and Arabic (RTL)

### Dashboard & Admin Console

- **Tenant Management**: Onboard and manage multiple WhatsApp Business Accounts
- **Analytics & Reporting**: Comprehensive metrics on message volume, response times, and costs
- **Template Management**: Create, submit, and manage message templates
- **Webhook Configuration**: Set up and monitor webhook endpoints
- **Branding Customization**: White-label the platform with your own branding

### Agent Workspace

- **Intuitive Chat Interface**: Modern, responsive design for efficient customer interactions
- **Quick Replies**: Pre-defined responses for common questions
- **Voice Notes**: Record and send voice messages (up to 3 minutes)
- **In-Chat Forms**: Create and send forms to collect structured data from customers
- **Contact Information**: View customer details and custom variant fields during chats
- **Task Management**: Create and manage follow-up tasks for customers
- **Sound Notifications**: Audio alerts for new messages and assignments

### iOS Companion App

- **Native SwiftUI Design**: Beautiful, intuitive mobile experience
- **Push Notifications**: Real-time alerts for new messages and events
- **Offline Support**: Queue messages when offline and send when connection is restored
- **Secure Authentication**: OAuth2/JWT authentication with role-based access
- **Full Feature Parity**: All web features available on mobile

### AI Assistant & Automation

- **Dual AI Providers**: Choose between ChatGPT and self-hosted DeepSeek R1
- **Intent Detection**: Automatically classify incoming customer queries
- **Response Suggestions**: AI-generated response options for agents
- **Entity Extraction**: Identify key information in customer messages
- **Continuous Learning**: Improve over time with agent feedback
- **Flow Designer**: Visual tool to create automated conversation flows
- **Custom Knowledge Base**: Train the AI with your own data

### Contact Management

- **Phone Book**: Organize contacts into hierarchical groups
- **Custom Variant Fields**: Define and manage custom fields for contacts
- **Role-Based Access**: Control who can view, edit, and message contacts
- **Flow Integration**: Use contact data in automated flows
- **Agent View**: Display key contact information to agents during chats

## Technical Specifications

### Backend Architecture

- **Framework**: FastAPI (Python)
- **Database**: MongoDB for flexible, document-based storage
- **Cache**: Redis for high-performance caching
- **Authentication**: JWT-based authentication with role-based access control
- **Real-Time Communication**: WebSockets for live chat updates
- **Containerization**: Docker for easy deployment and scaling
- **API Documentation**: OpenAPI/Swagger documentation

### Frontend Architecture

- **Framework**: React with TypeScript
- **State Management**: React Context API and hooks
- **UI Components**: Custom component library with Tailwind CSS
- **Responsive Design**: Mobile-first approach for all screen sizes
- **Internationalization**: Full support for English, French, and Arabic
- **Accessibility**: WCAG 2.1 AA compliant

### iOS App Architecture

- **Framework**: SwiftUI with Combine
- **State Management**: MVVM architecture
- **Networking**: URLSession with async/await
- **Storage**: Core Data for local caching
- **Authentication**: Keychain for secure token storage
- **Push Notifications**: APNs integration

### Security Features

- **End-to-End Encryption**: Secure message storage and transmission
- **Role-Based Access Control**: Granular permissions for all user types
- **Two-Factor Authentication**: Additional security layer for sensitive operations
- **Audit Logging**: Comprehensive logs for all administrative actions
- **Data Retention Policies**: Configurable message and media retention
- **GDPR Compliance**: Tools for data privacy and protection

## Use Cases

### Customer Service

- Handle customer inquiries through WhatsApp
- Automate responses to common questions
- Escalate complex issues to human agents
- Collect customer feedback through in-chat forms
- Track customer satisfaction and agent performance

### Sales & Marketing

- Send promotional messages to opted-in customers
- Create interactive product catalogs
- Process orders directly through WhatsApp
- Follow up with leads using automated flows
- Track conversion rates and campaign performance

### Appointment Scheduling

- Send appointment reminders
- Allow customers to book, reschedule, or cancel appointments
- Collect pre-appointment information through forms
- Send post-appointment follow-ups
- Integrate with calendar systems

### Technical Support

- Troubleshoot customer issues through WhatsApp
- Send step-by-step guides with images and videos
- Collect diagnostic information through forms
- Escalate complex issues to specialized agents
- Track resolution times and satisfaction rates

## Pricing

iMix CRM by IPROD offers flexible pricing plans to suit businesses of all sizes:

### Starter Plan

- 1 WhatsApp Business Account
- 5 Agents
- 1,000 messages per day
- Basic AI Assistant
- Email support

### Professional Plan

- 3 WhatsApp Business Accounts
- 15 Agents
- 5,000 messages per day
- Advanced AI Assistant
- Priority email and chat support
- Custom branding

### Enterprise Plan

- Unlimited WhatsApp Business Accounts
- Unlimited Agents
- Unlimited messages
- Premium AI Assistant with custom training
- 24/7 dedicated support
- Custom integration services
- On-premises deployment option

Contact us for custom pricing and enterprise solutions.

## System Requirements

### Server Requirements

- **Operating System**: Ubuntu 20.04 LTS or newer
- **CPU**: 4+ cores
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 50GB minimum, SSD recommended
- **Database**: MongoDB 4.4+
- **Redis**: Redis 6.0+

### Client Requirements

- **Web Browser**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **iOS App**: iOS 14.0 or newer
- **Internet Connection**: 1 Mbps or faster

## Getting Started

1. Sign up for an account at [imix.ip.mr](https://imix.ip.mr)
2. Configure your WhatsApp Business Account
3. Set up your team by inviting agents
4. Create message templates
5. Start engaging with your customers

## Support & Resources

- **Documentation**: Comprehensive guides for administrators, tenants, and agents
- **Video Tutorials**: Step-by-step visual instructions for common tasks
- **Knowledge Base**: Answers to frequently asked questions
- **Community Forum**: Connect with other users and share best practices
- **Support Team**: Dedicated support via email, chat, or phone

## About IPROD

IPROD is a leading provider of communication and customer engagement solutions. With over a decade of experience in developing innovative software for businesses, IPROD is committed to helping organizations build stronger relationships with their customers through effective digital communication channels.

For more information, visit [iprod.mr](https://iprod.mr) or contact us at info@iprod.mr.
