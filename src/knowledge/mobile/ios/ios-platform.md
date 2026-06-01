---
name: ios-platform
description: Apple Human Interface Guidelines compliance, local storage patterns, iOS testing, and App Store requirements
---

# iOS — Platform & Distribution

## Apple Human Interface Guidelines (HIG) Compliance

- **Navigation**: use `NavigationStack` (iOS 16+); respect back button behavior
- **Tab bars**: 3–5 tabs maximum; icons must have text labels
- **Modals**: use for tasks that interrupt workflow; always provide a dismiss mechanism
- **Typography**: use Dynamic Type — never hardcode font sizes
- **Color**: use semantic colors (`Color(.systemBackground)`, `.label`) for automatic dark mode
- **Safe areas**: always respect safe area insets; never overlap system chrome
- **Touch targets**: minimum 44×44pt for all interactive elements

## Modifier Order Convention

```swift
Text("Hello")
    .font(.headline)        // 1. Typography
    .foregroundColor(.blue) // 2. Color
    .padding()              // 3. Internal spacing
    .background(.gray)      // 4. Background
    .cornerRadius(8)        // 5. Shape
    .padding(.horizontal)   // 6. External spacing
```

## Local Storage

| Use case | Solution |
|---|---|
| Complex relational data | Core Data or SwiftData (iOS 17+) |
| Simple settings | UserDefaults |
| Sensitive data (tokens, passwords) | Keychain |
| Files, documents | FileManager |

Never store credentials in UserDefaults.

## Testing

- **XCTest / Swift Testing** (Xcode 16+): unit tests for ViewModels, use cases, utilities
- **XCUITest**: E2E UI testing for critical user flows
- Mock with protocols — inject dependencies via initializer, not global singletons

```swift
// Protocol-based mocking
protocol UserRepository {
    func fetchUser(id: String) async throws -> User
}

class MockUserRepository: UserRepository {
    var mockUser: User = .mock
    func fetchUser(id: String) async throws -> User { mockUser }
}
```

## App Store Requirements

- **Privacy manifest** (`PrivacyInfo.xcprivacy`) required for all new apps
- **Privacy nutrition labels** must accurately reflect data collection
- **In-app purchases** must use StoreKit (no external payment links for digital goods)
- **Age-appropriate design** requirements for apps targeting children
- **Screenshots** required for every supported device size
- **App Review Guidelines section 4.0**: apps must follow iOS design patterns
