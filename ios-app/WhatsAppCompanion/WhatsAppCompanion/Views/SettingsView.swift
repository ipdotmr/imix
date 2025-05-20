import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var showingLogoutConfirmation = false
    @State private var selectedLanguage = "English"
    @State private var notificationsEnabled = true
    @State private var darkModeEnabled = false
    
    let languages = ["English", "French", "Arabic"]
    
    var body: some View {
        NavigationView {
            List {
                Section {
                    HStack {
                        Image(systemName: "person.circle.fill")
                            .resizable()
                            .frame(width: 60, height: 60)
                            .foregroundColor(.gray)
                        
                        VStack(alignment: .leading) {
                            Text(authManager.currentUser?.fullName ?? "User Name")
                                .font(.headline)
                            
                            Text(authManager.currentUser?.email ?? "user@example.com")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                            
                            Text(authManager.currentUser?.role ?? "Agent")
                                .font(.caption)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 2)
                                .background(Color.green.opacity(0.2))
                                .foregroundColor(.green)
                                .cornerRadius(4)
                        }
                    }
                    .padding(.vertical, 8)
                }
                
                Section(header: Text("Account")) {
                    NavigationLink(destination: Text("Profile Settings")) {
                        Label("Profile", systemImage: "person")
                    }
                    
                    NavigationLink(destination: NotificationSettingsView(notificationsEnabled: $notificationsEnabled)) {
                        Label("Notifications", systemImage: "bell")
                    }
                    
                    NavigationLink(destination: Text("Privacy Settings")) {
                        Label("Privacy", systemImage: "lock")
                    }
                }
                
                Section(header: Text("App")) {
                    NavigationLink(destination: Text("Chat Settings")) {
                        Label("Chats", systemImage: "bubble.left.and.bubble.right")
                    }
                    
                    NavigationLink(destination: AppearanceSettingsView(darkModeEnabled: $darkModeEnabled)) {
                        Label("Appearance", systemImage: "paintbrush")
                    }
                    
                    NavigationLink(destination: LanguageSettingsView(selectedLanguage: $selectedLanguage, languages: languages)) {
                        Label("Language", systemImage: "globe")
                    }
                }
                
                Section(header: Text("Support")) {
                    NavigationLink(destination: Text("Help Center")) {
                        Label("Help", systemImage: "questionmark.circle")
                    }
                    
                    NavigationLink(destination: AboutView()) {
                        Label("About", systemImage: "info.circle")
                    }
                }
                
                Section {
                    Button(action: {
                        showingLogoutConfirmation = true
                    }) {
                        HStack {
                            Spacer()
                            Text("Log Out")
                                .foregroundColor(.red)
                            Spacer()
                        }
                    }
                }
            }
            .listStyle(InsetGroupedListStyle())
            .navigationTitle("Settings")
            .alert(isPresented: $showingLogoutConfirmation) {
                Alert(
                    title: Text("Log Out"),
                    message: Text("Are you sure you want to log out?"),
                    primaryButton: .destructive(Text("Log Out")) {
                        authManager.logout()
                    },
                    secondaryButton: .cancel()
                )
            }
        }
    }
}

struct NotificationSettingsView: View {
    @Binding var notificationsEnabled: Bool
    @State private var messageNotifications = true
    @State private var groupNotifications = true
    @State private var mentionNotifications = true
    
    var body: some View {
        Form {
            Section(header: Text("Notifications")) {
                Toggle("Enable Notifications", isOn: $notificationsEnabled)
            }
            
            if notificationsEnabled {
                Section(header: Text("Message Notifications")) {
                    Toggle("Direct Messages", isOn: $messageNotifications)
                    Toggle("Group Messages", isOn: $groupNotifications)
                    Toggle("Mentions", isOn: $mentionNotifications)
                }
                
                Section(header: Text("Sound")) {
                    Picker("Notification Sound", selection: .constant("Default")) {
                        Text("Default").tag("Default")
                        Text("Classic").tag("Classic")
                        Text("Subtle").tag("Subtle")
                        Text("None").tag("None")
                    }
                }
            }
        }
        .navigationTitle("Notifications")
    }
}

struct AppearanceSettingsView: View {
    @Binding var darkModeEnabled: Bool
    @State private var fontSize = 1 // 0: Small, 1: Medium, 2: Large
    
    var body: some View {
        Form {
            Section(header: Text("Theme")) {
                Toggle("Dark Mode", isOn: $darkModeEnabled)
            }
            
            Section(header: Text("Text Size")) {
                Picker("Font Size", selection: $fontSize) {
                    Text("Small").tag(0)
                    Text("Medium").tag(1)
                    Text("Large").tag(2)
                }
                .pickerStyle(SegmentedPickerStyle())
            }
            
            Section(header: Text("Chat Wallpaper")) {
                NavigationLink(destination: Text("Select Wallpaper")) {
                    Text("Change Wallpaper")
                }
            }
        }
        .navigationTitle("Appearance")
    }
}

struct LanguageSettingsView: View {
    @Binding var selectedLanguage: String
    let languages: [String]
    
    var body: some View {
        Form {
            Section(header: Text("Select Language")) {
                ForEach(languages, id: \.self) { language in
                    Button(action: {
                        selectedLanguage = language
                    }) {
                        HStack {
                            Text(language)
                            Spacer()
                            if selectedLanguage == language {
                                Image(systemName: "checkmark")
                                    .foregroundColor(.green)
                            }
                        }
                    }
                    .foregroundColor(.primary)
                }
            }
        }
        .navigationTitle("Language")
    }
}

struct AboutView: View {
    var body: some View {
        Form {
            Section(header: Text("App Information")) {
                HStack {
                    Text("Version")
                    Spacer()
                    Text("1.0.0")
                        .foregroundColor(.gray)
                }
                
                HStack {
                    Text("Bundle ID")
                    Spacer()
                    Text("com.iprod.terminal")
                        .foregroundColor(.gray)
                }
            }
            
            Section(header: Text("Legal")) {
                NavigationLink(destination: Text("Terms of Service")) {
                    Text("Terms of Service")
                }
                
                NavigationLink(destination: Text("Privacy Policy")) {
                    Text("Privacy Policy")
                }
                
                NavigationLink(destination: Text("Licenses")) {
                    Text("Licenses")
                }
            }
        }
        .navigationTitle("About")
    }
}

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
            .environmentObject(AuthManager())
    }
}
