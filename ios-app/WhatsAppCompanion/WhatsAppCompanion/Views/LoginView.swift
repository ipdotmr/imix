import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var email = ""
    @State private var password = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Image(systemName: "message.fill")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 80, height: 80)
                    .foregroundColor(.green)
                    .padding(.bottom, 20)
                
                Text("iMix CRM")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Text("WhatsApp Business Companion")
                    .font(.headline)
                    .foregroundColor(.secondary)
                    .padding(.bottom, 40)
                
                VStack(spacing: 15) {
                    TextField("Email", text: $email)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                    
                    SecureField("Password", text: $password)
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                    
                    if let error = authManager.error {
                        Text(error)
                            .foregroundColor(.red)
                            .font(.caption)
                            .padding(.top, 5)
                    }
                    
                    Button(action: {
                        authManager.login(email: email, password: password)
                    }) {
                        if authManager.isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.green)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                        } else {
                            Text("Log In")
                                .fontWeight(.semibold)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.green)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                        }
                    }
                    .disabled(authManager.isLoading)
                }
                .padding(.horizontal, 20)
                
                Spacer()
                
                Text("Version 1.0.0")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .padding()
            .navigationBarHidden(true)
        }
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
            .environmentObject(AuthManager())
    }
}
