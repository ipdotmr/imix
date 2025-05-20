import SwiftUI

struct ChatView: View {
    @State private var message = ""
    @State private var messages: [ChatMessage] = []
    @State private var showingLabelPicker = false
    @State private var showingQuickReplies = false
    let contact: Contact
    
    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Button(action: {}) {
                    Image(systemName: "chevron.left")
                        .foregroundColor(.green)
                }
                
                Image(systemName: "person.circle.fill")
                    .resizable()
                    .frame(width: 40, height: 40)
                    .foregroundColor(.gray)
                
                VStack(alignment: .leading) {
                    Text(contact.name)
                        .font(.headline)
                    Text("Online")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                
                Spacer()
                
                Button(action: { showingLabelPicker = true }) {
                    Image(systemName: "tag")
                        .foregroundColor(.green)
                }
                
                Menu {
                    Button(action: {}) {
                        Label("Assign Chat", systemImage: "person.badge.plus")
                    }
                    Button(action: {}) {
                        Label("Add Note", systemImage: "note.text")
                    }
                    Button(action: {}) {
                        Label("Block", systemImage: "slash.circle")
                    }
                    Button(action: {}) {
                        Label("Archive", systemImage: "archivebox")
                    }
                } label: {
                    Image(systemName: "ellipsis")
                        .foregroundColor(.green)
                }
            }
            .padding()
            .background(Color(.systemBackground))
            .shadow(color: Color.black.opacity(0.1), radius: 1)
            
            ScrollView {
                LazyVStack {
                    ForEach(messages) { message in
                        ChatBubble(message: message)
                            .padding(.horizontal)
                            .padding(.top, 8)
                    }
                }
                .padding(.bottom, 8)
            }
            .background(Color(.systemGroupedBackground))
            
            VStack(spacing: 0) {
                if showingQuickReplies {
                    QuickRepliesView(onSelect: { reply in
                        message = reply
                        showingQuickReplies = false
                    })
                    .frame(height: 120)
                    .background(Color(.systemBackground))
                    .transition(.move(edge: .bottom))
                }
                
                HStack {
                    Button(action: {}) {
                        Image(systemName: "plus")
                            .foregroundColor(.green)
                            .padding(10)
                            .background(Color(.systemGray6))
                            .clipShape(Circle())
                    }
                    
                    TextField("Type a message", text: $message, onEditingChanged: { editing in
                        if editing && message.hasPrefix("//") {
                            showingQuickReplies = true
                        } else if !message.hasPrefix("//") {
                            showingQuickReplies = false
                        }
                    })
                    .padding(10)
                    .background(Color(.systemGray6))
                    .cornerRadius(20)
                    
                    if message.isEmpty {
                        Button(action: {}) {
                            Image(systemName: "camera")
                                .foregroundColor(.green)
                                .padding(10)
                                .background(Color(.systemGray6))
                                .clipShape(Circle())
                        }
                        
                        Button(action: {}) {
                            Image(systemName: "mic")
                                .foregroundColor(.green)
                                .padding(10)
                                .background(Color(.systemGray6))
                                .clipShape(Circle())
                        }
                    } else {
                        Button(action: sendMessage) {
                            Image(systemName: "paperplane.fill")
                                .foregroundColor(.white)
                                .padding(10)
                                .background(Color.green)
                                .clipShape(Circle())
                        }
                    }
                }
                .padding()
                .background(Color(.systemBackground))
            }
        }
        .sheet(isPresented: $showingLabelPicker) {
            LabelPickerView(onSelect: { label in
                showingLabelPicker = false
            })
        }
        .onAppear {
            loadSampleMessages()
        }
    }
    
    private func sendMessage() {
        guard !message.isEmpty else { return }
        
        let newMessage = ChatMessage(
            id: UUID().uuidString,
            content: message,
            isFromCurrentUser: true,
            timestamp: Date()
        )
        
        messages.append(newMessage)
        message = ""
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            let response = ChatMessage(
                id: UUID().uuidString,
                content: "Thanks for your message!",
                isFromCurrentUser: false,
                timestamp: Date()
            )
            messages.append(response)
        }
    }
    
    private func loadSampleMessages() {
        messages = [
            ChatMessage(id: "1", content: "Hello, how can I help you today?", isFromCurrentUser: false, timestamp: Date().addingTimeInterval(-3600)),
            ChatMessage(id: "2", content: "I have a question about my order", isFromCurrentUser: true, timestamp: Date().addingTimeInterval(-3500)),
            ChatMessage(id: "3", content: "Sure, I'd be happy to help. Could you provide your order number?", isFromCurrentUser: false, timestamp: Date().addingTimeInterval(-3400))
        ]
    }
}

struct ChatBubble: View {
    let message: ChatMessage
    
    var body: some View {
        HStack {
            if message.isFromCurrentUser {
                Spacer()
                Text(message.content)
                    .padding(12)
                    .background(Color.green)
                    .foregroundColor(.white)
                    .cornerRadius(16)
                    .cornerRadius(16, corners: [.topLeft, .topRight, .bottomLeft])
            } else {
                Text(message.content)
                    .padding(12)
                    .background(Color(.systemGray5))
                    .foregroundColor(.black)
                    .cornerRadius(16)
                    .cornerRadius(16, corners: [.topLeft, .topRight, .bottomRight])
                Spacer()
            }
        }
    }
}

struct ChatMessage: Identifiable {
    let id: String
    let content: String
    let isFromCurrentUser: Bool
    let timestamp: Date
}

struct QuickRepliesView: View {
    let onSelect: (String) -> Void
    let quickReplies = [
        "Thank you for contacting us. How can I help you today?",
        "I'll check that for you right away.",
        "Could you please provide more details?",
        "Is there anything else you need help with?",
        "Let me transfer you to a specialist who can better assist you."
    ]
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 8) {
                Text("Quick Replies")
                    .font(.headline)
                    .padding(.horizontal)
                    .padding(.top, 8)
                
                ForEach(quickReplies, id: \.self) { reply in
                    Button(action: { onSelect(reply) }) {
                        Text(reply)
                            .padding(8)
                            .background(Color(.systemGray6))
                            .cornerRadius(8)
                            .foregroundColor(.primary)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                    .padding(.horizontal)
                }
            }
        }
    }
}

extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(roundedRect: rect, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        return Path(path.cgPath)
    }
}

struct ChatView_Previews: PreviewProvider {
    static var previews: some View {
        ChatView(contact: Contact(id: "1", name: "John Doe", phoneNumber: "+1234567890"))
    }
}
