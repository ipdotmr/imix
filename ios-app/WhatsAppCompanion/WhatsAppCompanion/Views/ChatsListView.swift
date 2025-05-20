import SwiftUI

struct ChatsListView: View {
    @State private var searchText = ""
    @State private var conversations: [Conversation] = []
    
    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Text("Chats")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Spacer()
                
                Button(action: {}) {
                    Image(systemName: "square.and.pencil")
                        .font(.title2)
                        .foregroundColor(.green)
                }
            }
            .padding()
            
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.gray)
                
                TextField("Search", text: $searchText)
                
                if !searchText.isEmpty {
                    Button(action: { searchText = "" }) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.gray)
                    }
                }
            }
            .padding(8)
            .background(Color(.systemGray6))
            .cornerRadius(10)
            .padding(.horizontal)
            
            List {
                ForEach(filteredConversations) { conversation in
                    NavigationLink(destination: ChatView(contact: conversation.contact)) {
                        HStack {
                            Image(systemName: "person.circle.fill")
                                .resizable()
                                .frame(width: 50, height: 50)
                                .foregroundColor(.gray)
                            
                            VStack(alignment: .leading) {
                                HStack {
                                    Text(conversation.contact.name)
                                        .font(.headline)
                                    
                                    if !conversation.labels.isEmpty {
                                        ForEach(conversation.labels.prefix(2), id: \.self) { label in
                                            Text(label)
                                                .font(.caption)
                                                .padding(.horizontal, 6)
                                                .padding(.vertical, 2)
                                                .background(labelColor(for: label))
                                                .foregroundColor(.white)
                                                .cornerRadius(4)
                                        }
                                    }
                                }
                                
                                Text(conversation.lastMessage)
                                    .font(.subheadline)
                                    .foregroundColor(.gray)
                                    .lineLimit(1)
                            }
                            
                            Spacer()
                            
                            VStack(alignment: .trailing) {
                                Text(formatTime(conversation.timestamp))
                                    .font(.caption)
                                    .foregroundColor(.gray)
                                
                                if conversation.unreadCount > 0 {
                                    Text("\(conversation.unreadCount)")
                                        .font(.caption)
                                        .foregroundColor(.white)
                                        .frame(width: 20, height: 20)
                                        .background(Color.green)
                                        .clipShape(Circle())
                                }
                            }
                        }
                        .padding(.vertical, 4)
                    }
                    .swipeActions {
                        Button(role: .destructive) {
                        } label: {
                            Label("Block", systemImage: "slash.circle")
                        }
                        
                        Button {
                        } label: {
                            Label("Archive", systemImage: "archivebox")
                        }
                        .tint(.blue)
                    }
                }
            }
            .listStyle(PlainListStyle())
        }
        .onAppear {
            loadSampleConversations()
        }
    }
    
    var filteredConversations: [Conversation] {
        if searchText.isEmpty {
            return conversations
        } else {
            return conversations.filter { $0.contact.name.lowercased().contains(searchText.lowercased()) }
        }
    }
    
    private func formatTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
    
    private func labelColor(for label: String) -> Color {
        switch label.lowercased() {
        case "urgent":
            return .red
        case "support":
            return .blue
        case "sales":
            return .green
        case "feedback":
            return .purple
        case "resolved":
            return .gray
        default:
            return .orange
        }
    }
    
    private func loadSampleConversations() {
        conversations = [
            Conversation(
                id: "1",
                contact: Contact(id: "1", name: "John Doe", phoneNumber: "+1234567890"),
                lastMessage: "Thanks for your help!",
                timestamp: Date().addingTimeInterval(-300),
                unreadCount: 3,
                labels: ["Urgent", "Support"]
            ),
            Conversation(
                id: "2",
                contact: Contact(id: "2", name: "Jane Smith", phoneNumber: "+1987654321"),
                lastMessage: "When will my order arrive?",
                timestamp: Date().addingTimeInterval(-1800),
                unreadCount: 0,
                labels: ["Sales"]
            ),
            Conversation(
                id: "3",
                contact: Contact(id: "3", name: "Bob Johnson", phoneNumber: "+1122334455"),
                lastMessage: "I'd like to provide some feedback about your service",
                timestamp: Date().addingTimeInterval(-7200),
                unreadCount: 1,
                labels: ["Feedback"]
            ),
            Conversation(
                id: "4",
                contact: Contact(id: "4", name: "Alice Brown", phoneNumber: "+1555666777"),
                lastMessage: "Is there a discount for bulk orders?",
                timestamp: Date().addingTimeInterval(-86400),
                unreadCount: 0,
                labels: ["Sales"]
            ),
            Conversation(
                id: "5",
                contact: Contact(id: "5", name: "Charlie Davis", phoneNumber: "+1888999000"),
                lastMessage: "Thank you for resolving my issue",
                timestamp: Date().addingTimeInterval(-172800),
                unreadCount: 0,
                labels: ["Resolved"]
            )
        ]
    }
}

struct Conversation: Identifiable {
    let id: String
    let contact: Contact
    let lastMessage: String
    let timestamp: Date
    let unreadCount: Int
    let labels: [String]
}

struct Contact: Identifiable {
    let id: String
    let name: String
    let phoneNumber: String
    var unreadCount: Int = 0
}

struct ChatsListView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            ChatsListView()
        }
    }
}
