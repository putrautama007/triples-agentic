# iOS Development Knowledge

## Architecture

Use **MVVM** or **TCA (The Composable Architecture)** for new SwiftUI projects:

```
View (SwiftUI) — observes ViewModel state
    ↕ @Published / @Observable
ViewModel — business logic, state management
    ↕ async/await
Repository / Service — data access, network calls
```

## SwiftUI (Preferred UI Framework)

### View Design
- Views are value types (structs) — designed to be cheap and recreated often
- Extract subviews into separate structs when a View body exceeds ~30 lines
- `@State` for local ephemeral state only; `@StateObject` / `@ObservedObject` for ViewModels
- `@EnvironmentObject` for app-wide state (theme, auth context, user preferences)

```swift
// Correct: view observes ViewModel
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

### Modifiers Order Convention
```swift
Text("Hello")
    .font(.headline)        // 1. Typography
    .foregroundColor(.blue) // 2. Color
    .padding()              // 3. Internal spacing
    .background(.gray)      // 4. Background
    .cornerRadius(8)        // 5. Shape
    .padding(.horizontal)   // 6. External spacing
```

## Apple Human Interface Guidelines (HIG) Compliance

- **Navigation**: use `NavigationStack` (iOS 16+); respect back button behavior
- **Tab bars**: 3–5 tabs maximum; icons must have text labels
- **Modals**: use for tasks that interrupt workflow; always provide a dismiss mechanism
- **Typography**: use Dynamic Type — never hardcode font sizes
- **Color**: use semantic colors (`Color(.systemBackground)`, `.label`) for automatic dark mode support
- **Safe areas**: always respect safe area insets; never overlap system chrome

## State Management

```swift
// @Observable macro (iOS 17+, Swift 5.9)
@Observable
class LoginViewModel {
    var email = ""
    var password = ""
    var isLoading = false
    
    func login() async {
        isLoading = true
        defer { isLoading = false }
        // ...
    }
}

// Legacy @ObservableObject (iOS 13+)
class LoginViewModel: ObservableObject {
    @Published var email = ""
    @Published var isLoading = false
}
```

## Networking

- **URLSession** with async/await (native, no extra dependency)
- **Alamofire** for complex networking (multipart uploads, retry logic, interceptors)
- Always decode on a background thread; update UI on `@MainActor`

```swift
func fetchUser(id: String) async throws -> User {
    let (data, response) = try await URLSession.shared.data(from: url)
    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 200 else {
        throw APIError.invalidResponse
    }
    return try JSONDecoder().decode(User.self, from: data)
}
```

## Local Storage

- **Core Data**: complex relational data with sync (CloudKit integration)
- **SwiftData** (iOS 17+): modern replacement for Core Data with `@Model` macro
- **UserDefaults**: simple key-value (non-sensitive settings only)
- **Keychain**: secure storage for tokens, passwords, sensitive data
- **FileManager**: binary files, documents, caches

## Navigation (NavigationStack — iOS 16+)

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

## Testing

- **Unit tests**: XCTest for ViewModels, use cases, utilities
- **UI tests**: XCUITest for critical user flows
- **Swift Testing** (Xcode 16+): modern testing framework with `#expect` macros
- Mock with protocols — inject dependencies via initializer, not global singletons

## App Store Requirements

- Privacy manifest (`PrivacyInfo.xcprivacy`) required for all new apps
- Privacy nutrition labels must accurately reflect data collection
- Age-appropriate design requirements (if app is for children)
- In-app purchases must use StoreKit (no external payment links for digital goods)
- Screenshots required for every supported device size
- Review guidelines section 4.0 (Design): apps must follow iOS design patterns
