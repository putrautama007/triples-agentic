---
name: swift-core
description: Swift optionals, value vs reference types, error handling, and the Swift API Design Guidelines
---

# Swift — Core Language

## Optionals

```swift
var name: String? = nil

// Optional binding (preferred)
if let name = name { print("Name: \(name)") }

// Guard (preferred for early exits)
guard let name = name else { return }

// Nil coalescing
let displayName = name ?? "Anonymous"

// Optional chaining
let count = name?.count
```

## Value Types vs Reference Types

```swift
// Struct (value type) — prefer for data models
struct User {
    var id: String
    var name: String
}

// Class (reference type) — use for shared mutable state, ViewModels
class UserViewModel: ObservableObject {
    @Published var user: User?
}

// Enum with associated values
enum PaymentMethod {
    case creditCard(last4: String)
    case paypal(email: String)
    case applePay
}
```

## Error Handling

```swift
enum AuthError: Error, LocalizedError {
    case invalidCredentials
    case networkUnavailable

    var errorDescription: String? {
        switch self {
        case .invalidCredentials: return "Invalid email or password"
        case .networkUnavailable: return "No internet connection"
        }
    }
}

// Throw and catch
do {
    let token = try await login(email: email, password: password)
} catch AuthError.invalidCredentials {
    showError("Check your email and password")
} catch {
    showError(error.localizedDescription)
}
```

## Swift API Design Guidelines

- **Clarity at the call site**: `x.insert(y, at: z)` reads better than `x.insert(y, z)`
- **Name methods for their side effects**: mutating → verb (`append`); non-mutating → noun (`sorted`)
- **Boolean names read as assertions**: `isEmpty`, `isValid`, `canSubmit`
- **Parameter labels clarify arguments**: `move(from: a, to: b)` not `move(a, b)`
- **Avoid abbreviations**: `numberOfLines` not `numLines`
