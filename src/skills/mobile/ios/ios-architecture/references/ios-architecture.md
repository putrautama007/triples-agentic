---
name: ios-architecture
description: iOS MVVM architecture, SwiftUI view design, state management (@Observable, @ObservableObject), and networking
---

# iOS Architecture

## Architecture Pattern: MVVM

```
View (SwiftUI) — observes ViewModel state
    ↕ @Published / @Observable
ViewModel — business logic, state management
    ↕ async/await
Repository / Service — data access, network calls
```

## SwiftUI View Design

- Views are value types (structs) — cheap to recreate
- Extract subviews into separate structs when body exceeds ~30 lines
- `@State` for local ephemeral state only
- `@StateObject` / `@ObservedObject` for ViewModels
- `@EnvironmentObject` for app-wide state (theme, auth context)

```swift
// View observes ViewModel — correct pattern
struct LoginView: View {
    @StateObject private var viewModel = LoginViewModel()

    var body: some View {
        VStack {
            TextField("Email", text: $viewModel.email)
            Button("Log in") { viewModel.login() }
        }
    }
}
```

## State Management

```swift
// @Observable macro (iOS 17+, Swift 5.9)
@Observable
class LoginViewModel {
    var email = ""
    var isLoading = false

    func login() async {
        isLoading = true
        defer { isLoading = false }
        // network call
    }
}

// @ObservableObject (iOS 13+ compatibility)
class LoginViewModel: ObservableObject {
    @Published var email = ""
    @Published var isLoading = false
}
```

## Networking — async/await

```swift
func fetchUser(id: String) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\(id)")!
    let (data, response) = try await URLSession.shared.data(from: url)
    guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
        throw APIError.invalidResponse
    }
    return try JSONDecoder().decode(User.self, from: data)
}
```

## Navigation — NavigationStack (iOS 16+)

```swift
NavigationStack(path: $navigationPath) {
    HomeView()
        .navigationDestination(for: UserRoute.self) { route in
            switch route {
            case .profile(let id): UserProfileView(userId: id)
            case .settings: SettingsView()
            }
        }
}
```
