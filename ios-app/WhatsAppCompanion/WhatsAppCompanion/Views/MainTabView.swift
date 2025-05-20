import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            NavigationView {
                ChatsListView()
            }
            .tabItem {
                Label("Chats", systemImage: "message.fill")
            }
            .tag(0)
            
            NavigationView {
                ContactsView()
            }
            .tabItem {
                Label("Contacts", systemImage: "person.2.fill")
            }
            .tag(1)
            
            NavigationView {
                SettingsView()
            }
            .tabItem {
                Label("Settings", systemImage: "gear")
            }
            .tag(2)
        }
        .accentColor(.green)
    }
}

struct ChatsListView: View {
    @State private var searchText = ""
    
    var body: some View {
        VStack {
            List {
                ForEach(1...10, id: \.self) { index in
                    ChatRow(
                        name: "Contact \(index)",
                        message: "Latest message from contact \(index)",
                        time: "10:0\(index)AM",
                        unreadCount: index % 3 == 0 ? index : 0
                    )
                }
            }
            .listStyle(PlainListStyle())
        }
        .navigationTitle("Chats")
        .navigationBarItems(
            trailing: Button(action: {}) {
                Image(systemName: "square.and.pencil")
            }
        )
        .searchable(text: $searchText, prompt: "Search")
    }
}

struct ChatRow: View {
    let name: String
    let message: String
    let time: String
    let unreadCount: Int
    
    var body: some View {
        HStack {
            Circle()
                .fill(Color.gray.opacity(0.3))
                .frame(width: 60, height: 60)
                .overlay(
                    Text(String(name.prefix(1)))
                        .font(.title)
                        .foregroundColor(.gray)
                )
            
            VStack(alignment: .leading, spacing: 5) {
                HStack {
                    Text(name)
                        .font(.headline)
                    Spacer()
                    Text(time)
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                
                HStack {
                    Text(message)
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .lineLimit(1)
                    
                    Spacer()
                    
                    if unreadCount > 0 {
                        Text("\(unreadCount)")
                            .font(.caption)
                            .foregroundColor(.white)
                            .frame(width: 24, height: 24)
                            .background(Color.green)
                            .clipShape(Circle())
                    }
                }
            }
        }
        .padding(.vertical, 8)
    }
}

struct ContactsView: View {
    @State private var searchText = ""
    
    var body: some View {
        List {
            ForEach(1...15, id: \.self) { index in
                HStack {
                    Circle()
                        .fill(Color.gray.opacity(0.3))
                        .frame(width: 50, height: 50)
                        .overlay(
                            Text(String("C\(index)").prefix(1))
                                .font(.title2)
                                .foregroundColor(.gray)
                        )
                    
                    VStack(alignment: .leading) {
                        Text("Contact \(index)")
                            .font(.headline)
                        Text("+1 555-123-\(1000 + index)")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                    }
                }
                .padding(.vertical, 4)
            }
        }
        .navigationTitle("Contacts")
        .searchable(text: $searchText, prompt: "Search")
    }
}

struct SettingsView: View {
    @EnvironmentObject var authManager: AuthManager
    
    var body: some View {
        List {
            Section {
                HStack {
                    Circle()
                        .fill(Color.gray.opacity(0.3))
                        .frame(width: 60, height: 60)
                        .overlay(
                            Text(authManager.currentUser?.firstName.prefix(1) ?? "U")
                                .font(.title)
                                .foregroundColor(.gray)
                        )
                    
                    VStack(alignment: .leading) {
                        Text(authManager.currentUser?.fullName ?? "User")
                            .font(.headline)
                        Text(authManager.currentUser?.email ?? "user@example.com")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                    }
                }
                .padding(.vertical, 8)
            }
            
            Section(header: Text("Preferences")) {
                NavigationLink(destination: Text("Account Settings")) {
                    Label("Account", systemImage: "person.circle")
                }
                
                NavigationLink(destination: Text("Notifications Settings")) {
                    Label("Notifications", systemImage: "bell")
                }
                
                NavigationLink(destination: Text("Appearance Settings")) {
                    Label("Appearance", systemImage: "paintbrush")
                }
            }
            
            Section(header: Text("Support")) {
                NavigationLink(destination: Text("Help Center")) {
                    Label("Help", systemImage: "questionmark.circle")
                }
                
                NavigationLink(destination: Text("Contact Support")) {
                    Label("Contact Us", systemImage: "envelope")
                }
            }
            
            Section {
                Button(action: {
                    authManager.logout()
                }) {
                    Label("Log Out", systemImage: "arrow.right.square")
                        .foregroundColor(.red)
                }
            }
        }
        .navigationTitle("Settings")
    }
}

struct MainTabView_Previews: PreviewProvider {
    static var previews: some View {
        MainTabView()
            .environmentObject(AuthManager())
    }
}
