# iOS App Structure

## Models

### User.swift
```swift
struct User: Codable, Identifiable {
    let id: String
    let email: String
    let firstName: String
    let lastName: String
    let tenantId: String
    let role: String
}
```

### Message.swift
```swift
enum MessageType: String, Codable {
    case text, image, video, document, audio, sticker, location, contact, template, interactive
}

enum MessageStatus: String, Codable {
    case sent, delivered, read, failed
}

struct Message: Codable, Identifiable {
    let id: String
    let fromNumber: String
    let toNumber: String
    let messageType: MessageType
    let content: [String: Any]
    let whatsappMessageId: String?
    let status: MessageStatus
    let createdAt: Date
    let updatedAt: Date
}
```

### Contact.swift
```swift
struct Label: Codable {
    let name: String
    let color: String
}

struct Contact: Codable, Identifiable {
    let id: String
    let tenantId: String
    let whatsappAccountId: String
    let phoneNumber: String
    let name: String?
    let profileName: String?
    let labels: [Label]
    let customFields: [String: String]
}
```

## Views

### LoginView.swift
- Login form with email/password
- OAuth2/JWT authentication
- Tenant selection

### ChatListView.swift
- List of active conversations
- Search and filter functionality
- Unread message indicators

### ChatDetailView.swift
- Message thread view
- Message input with media attachments
- Typing indicators and read receipts

### SettingsView.swift
- User profile management
- Notification settings
- App preferences

## Services

### APIService.swift
- REST API client
- Authentication handling
- Request/response processing

### WebSocketService.swift
- Real-time messaging
- Typing indicators
- Online status updates

### PushNotificationService.swift
- Push notification registration
- Notification handling
- Badge count management

### OfflineQueueService.swift
- Message queue for offline mode
- Background sync
- Conflict resolution
```

## ViewModels

### AuthViewModel.swift
- Login/logout logic
- Token management
- User session handling

### ChatViewModel.swift
- Message loading and pagination
- Message sending and status tracking
- Typing indicator management

### ContactViewModel.swift
- Contact list management
- Contact search and filtering
- Contact labeling
