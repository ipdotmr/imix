import SwiftUI

struct ContactsView: View {
    @State private var searchText = ""
    @State private var contacts: [Contact] = []
    @State private var selectedLabel: String? = nil
    @State private var showingLabelPicker = false
    @State private var showingAddContactSheet = false
    @State private var selectedContact: Contact? = nil
    
    let labels = ["Support", "Sales", "VIP", "New", "Resolved"]
    
    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Text("Contacts")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Spacer()
                
                Button(action: { showingAddContactSheet = true }) {
                    Image(systemName: "person.badge.plus")
                        .font(.title2)
                        .foregroundColor(.green)
                }
            }
            .padding()
            
            VStack(spacing: 8) {
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
                
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack {
                        Button(action: { selectedLabel = nil }) {
                            Text("All")
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(selectedLabel == nil ? Color.green : Color(.systemGray6))
                                .foregroundColor(selectedLabel == nil ? .white : .primary)
                                .cornerRadius(16)
                        }
                        
                        ForEach(labels, id: \.self) { label in
                            Button(action: { selectedLabel = label }) {
                                Text(label)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(selectedLabel == label ? Color.green : Color(.systemGray6))
                                    .foregroundColor(selectedLabel == label ? .white : .primary)
                                    .cornerRadius(16)
                            }
                        }
                        
                        Button(action: { showingLabelPicker = true }) {
                            Image(systemName: "plus")
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(Color(.systemGray6))
                                .foregroundColor(.primary)
                                .cornerRadius(16)
                        }
                    }
                }
            }
            .padding(.horizontal)
            
            List {
                ForEach(filteredContacts) { contact in
                    NavigationLink(destination: ChatView(contact: contact)) {
                        HStack {
                            Image(systemName: "person.circle.fill")
                                .resizable()
                                .frame(width: 50, height: 50)
                                .foregroundColor(.gray)
                            
                            VStack(alignment: .leading) {
                                Text(contact.name)
                                    .font(.headline)
                                
                                Text(contact.phoneNumber)
                                    .font(.subheadline)
                                    .foregroundColor(.gray)
                            }
                            
                            Spacer()
                            
                            Button(action: {
                                selectedContact = contact
                                showingLabelPicker = true
                            }) {
                                Image(systemName: "tag")
                                    .foregroundColor(.green)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                    .contextMenu {
                        Button(action: {
                        }) {
                            Label("Start Chat", systemImage: "bubble.left")
                        }
                        
                        Button(action: {
                        }) {
                            Label("Add to Group", systemImage: "person.2")
                        }
                        
                        Button(action: {
                        }) {
                            Label("Block", systemImage: "slash.circle")
                        }
                        
                        Button(action: {
                        }) {
                            Label("Archive", systemImage: "archivebox")
                        }
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
        .sheet(isPresented: $showingLabelPicker) {
            LabelPickerView(onSelect: { label in
                showingLabelPicker = false
            })
        }
        .sheet(isPresented: $showingAddContactSheet) {
            AddContactView(onSave: { newContact in
                contacts.append(newContact)
                showingAddContactSheet = false
            })
        }
        .onAppear {
            loadSampleContacts()
        }
    }
    
    var filteredContacts: [Contact] {
        var filtered = contacts
        
        if !searchText.isEmpty {
            filtered = filtered.filter { $0.name.lowercased().contains(searchText.lowercased()) }
        }
        
        if let selectedLabel = selectedLabel {
            filtered = filtered.filter { $0.id.hashValue % labels.count == labels.firstIndex(of: selectedLabel) ?? 0 }
        }
        
        return filtered
    }
    
    private func loadSampleContacts() {
        contacts = [
            Contact(id: "1", name: "John Doe", phoneNumber: "+1234567890"),
            Contact(id: "2", name: "Jane Smith", phoneNumber: "+1987654321"),
            Contact(id: "3", name: "Bob Johnson", phoneNumber: "+1122334455"),
            Contact(id: "4", name: "Alice Brown", phoneNumber: "+1555666777"),
            Contact(id: "5", name: "Charlie Davis", phoneNumber: "+1888999000"),
            Contact(id: "6", name: "Eva Wilson", phoneNumber: "+1222333444"),
            Contact(id: "7", name: "Frank Miller", phoneNumber: "+1777888999"),
            Contact(id: "8", name: "Grace Taylor", phoneNumber: "+1444555666"),
            Contact(id: "9", name: "Henry Clark", phoneNumber: "+1999000111"),
            Contact(id: "10", name: "Ivy Martin", phoneNumber: "+1333444555")
        ]
    }
}

struct LabelPickerView: View {
    let onSelect: (String) -> Void
    let labels = ["Support", "Sales", "VIP", "New", "Resolved"]
    let colors: [Color] = [.red, .blue, .green, .orange, .purple]
    
    var body: some View {
        NavigationView {
            List {
                ForEach(0..<labels.count, id: \.self) { index in
                    Button(action: { onSelect(labels[index]) }) {
                        HStack {
                            Circle()
                                .fill(colors[index])
                                .frame(width: 16, height: 16)
                            Text(labels[index])
                            Spacer()
                        }
                    }
                }
                
                Button(action: {
                    onSelect("New Label")
                }) {
                    Label("Create New Label", systemImage: "plus")
                        .foregroundColor(.green)
                }
            }
            .navigationTitle("Select Label")
            .navigationBarItems(trailing: Button("Cancel") {
                onSelect("")
            })
        }
    }
}

struct AddContactView: View {
    let onSave: (Contact) -> Void
    
    @State private var name = ""
    @State private var phoneNumber = ""
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Contact Information")) {
                    TextField("Name", text: $name)
                    TextField("Phone Number", text: $phoneNumber)
                        .keyboardType(.phonePad)
                }
            }
            .navigationTitle("Add Contact")
            .navigationBarItems(
                leading: Button("Cancel") {
                    presentationMode.wrappedValue.dismiss()
                },
                trailing: Button("Save") {
                    let newContact = Contact(
                        id: UUID().uuidString,
                        name: name,
                        phoneNumber: phoneNumber
                    )
                    onSave(newContact)
                }
                .disabled(name.isEmpty || phoneNumber.isEmpty)
            )
        }
    }
}

struct ContactsView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            ContactsView()
        }
    }
}
