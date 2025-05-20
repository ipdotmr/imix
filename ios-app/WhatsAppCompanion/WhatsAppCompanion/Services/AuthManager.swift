import Foundation
import Combine
import KeychainSwift

class AuthManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var isLoading = false
    @Published var error: String?
    
    private let keychain = KeychainSwift()
    private let tokenKey = "auth_token"
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        if let token = keychain.get(tokenKey) {
            isAuthenticated = true
            fetchCurrentUser(token: token)
        }
    }
    
    func login(email: String, password: String) {
        isLoading = true
        error = nil
        
        let loginData = ["email": email, "password": password]
        
        guard let url = URL(string: "https://apimix.ip.mr/api/auth/login") else {
            self.error = "Invalid URL"
            self.isLoading = false
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: loginData)
        } catch {
            self.error = "Failed to encode login data"
            self.isLoading = false
            return
        }
        
        URLSession.shared.dataTaskPublisher(for: request)
            .map { $0.data }
            .decode(type: LoginResponse.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { [weak self] completion in
                self?.isLoading = false
                
                if case .failure(let error) = completion {
                    self?.error = error.localizedDescription
                }
            }, receiveValue: { [weak self] response in
                self?.keychain.set(response.token, forKey: self?.tokenKey ?? "")
                self?.isAuthenticated = true
                self?.fetchCurrentUser(token: response.token)
            })
            .store(in: &cancellables)
    }
    
    func logout() {
        keychain.delete(tokenKey)
        isAuthenticated = false
        currentUser = nil
    }
    
    private func fetchCurrentUser(token: String) {
        guard let url = URL(string: "https://apimix.ip.mr/api/users/me") else {
            self.error = "Invalid URL"
            return
        }
        
        var request = URLRequest(url: url)
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTaskPublisher(for: request)
            .map { $0.data }
            .decode(type: User.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { [weak self] completion in
                if case .failure(let error) = completion {
                    self?.error = error.localizedDescription
                    self?.isAuthenticated = false
                    self?.keychain.delete(self?.tokenKey ?? "")
                }
            }, receiveValue: { [weak self] user in
                self?.currentUser = user
            })
            .store(in: &cancellables)
    }
}

struct LoginResponse: Codable {
    let token: String
}
