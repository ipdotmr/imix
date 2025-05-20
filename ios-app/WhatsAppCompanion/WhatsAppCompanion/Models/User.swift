import Foundation

struct User: Codable, Identifiable {
    let id: String
    let email: String
    let firstName: String
    let lastName: String
    let role: String
    let tenantId: String
    let active: Bool
    
    var fullName: String {
        "\(firstName) \(lastName)"
    }
}
