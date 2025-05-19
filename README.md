# iMix CRM by IPROD

A cloud-native, multi-tenant WhatsApp Business API platform designed for resellers and agencies to onboard, configure, and manage multiple WhatsApp Business Accounts for their clients.

## Components

- **Multi-Tenant Cloud API**: Secure RESTful and Webhook-based API endpoints for WhatsApp Business integration
- **Dashboard & Admin Console**: React-based web dashboard for administrators
- **Agent Workspace**: Browser-based chat interface for agents with quick replies and sound notifications
- **iOS Companion App**: Native SwiftUI app for agents on the go
- **AI Assistant & Automation**: ML-powered assistant with dual providers (ChatGPT and DeepSeek R1)
- **Task Management**: Comprehensive task tracking and assignment system
- **Chat Tracing**: Track which agent responded to which client

## Tech Stack

- **Backend**: Python (FastAPI), MongoDB, Redis
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **iOS App**: Swift, SwiftUI, Combine
- **AI/ML**: OpenAI API, DeepSeek R1 (self-hosted at dayloul.sat.mr)
- **Infrastructure**: AWS/GCP, Docker, Kubernetes

## Development

### Backend

```bash
cd backend/whatsapp_api
poetry install
poetry run uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

- `/backend` - FastAPI backend services
- `/frontend` - React frontend application
- `/ios-app` - SwiftUI iOS companion app
- `/docs` - Project documentation

## Notification Sounds

The platform uses sound notifications to alert agents of new messages and events. The following sound files are required:

- `/frontend/public/sounds/new-message.mp3` - Played when a new message arrives
- `/frontend/public/sounds/task-assigned.mp3` - Played when a new task is assigned
- `/frontend/public/sounds/mention.mp3` - Played when an agent is mentioned in a chat
- `/frontend/public/sounds/call.mp3` - Played when a call is received

**Note**: The repository contains placeholder files. Replace them with actual sound files before deployment.

## Email Notifications

The platform supports email notifications via SMTP. Configure the SMTP settings in the tenant settings to enable email notifications for:

- New message notifications
- Task assignments
- Welcome emails for new users
- Password reset emails

## Milestones

- **MVP (8-10 weeks)**: Core API, dashboard, basic agent UI, simple iOS app
- **Phase 2 (6-8 weeks)**: AI Assistant, flow designer
- **Phase 3 (4-6 weeks)**: Advanced ML, billing, analytics, security
- **Final QA & Launch (4 weeks)**: Testing, tuning, rollout
