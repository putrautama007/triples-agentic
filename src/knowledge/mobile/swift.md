# Swift Language Knowledge

## Language Fundamentals

Swift prioritizes: type safety, performance, and clarity. The Swift API Design Guidelines are the canonical style reference.

## Optionals

```swift
// Declare optional explicitly
var name: String? = nil

// Optional binding (preferred)
if let name = name {
    print("Name: \(name)")
}

// Guard (preferred for early exits)
guard let name = name else {
    print("No name provided")
    return
}

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

## Async/Await

```swift
// Async function
func fetchUser(id: String) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\(id)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}

// Calling async code
Task {
    do {
        let user = try await fetchUser(id: "123")
        await MainActor.run { self.user = user }
    } catch {
        print("Error: \(error)")
    }
}

// Parallel execution
async let userFetch = fetchUser(id: userId)
async let ordersFetch = fetchOrders(userId: userId)
let (user, orders) = try await (userFetch, ordersFetch)
```

## Error Handling

```swift
// Define domain errors
enum AuthError: Error, LocalizedError {
    case invalidCredentials
    case networkUnavailable
    case tokenExpired
    
    var errorDescription: String? {
        switch self {
        case .invalidCredentials: return "Invalid email or password"
        case .networkUnavailable: return "No internet connection"
        case .tokenExpired: return "Session expired. Please log in again."
        }
    }
}

// Throw and catch
func login(email: String, password: String) async throws -> AuthToken {
    guard !email.isEmpty, !password.isEmpty else {
        throw AuthError.invalidCredentials
    }
    // ...
}

do {
    let token = try await login(email: email, password: password)
} catch AuthError.invalidCredentials {
    showError("Check your email and password")
} catch {
    showError(error.localizedDescription)
}
```

## Protocols & Generics

```swift
// Protocol with associated type
protocol Repository {
    associatedtype Model
    func fetch(id: String) async throws -> Model
    func save(_ model: Model) async throws
}

// Generic function
func first<T>(in array: [T], where condition: (T) -> Bool) -> T? {
    array.first(where: condition)
}

// Protocol composition
typealias ReadableRepository = Fetchable & Observable

// @Sendable for async contexts
func processItems(_ items: [Item], using handler: @Sendable (Item) async -> Void) async {
    await withTaskGroup(of: Void.self) { group in
        items.forEach { item in
            group.addTask { await handler(item) }
        }
    }
}
```

## Swift API Design Guidelines

- **Clarity at the call site**: `x.insert(y, at: z)` reads better than `x.insert(y, z)`
- **Name methods for their side effects**: mutating → verb (append, remove); non-mutating → noun (sorted, filtered)
- **Boolean names read as assertions**: `isEmpty`, `isValid`, `canSubmit`
- **Parameter labels clarify arguments**: `move(from: a, to: b)` not `move(a, b)`
- **Avoid abbreviations**: `numberOfLines` not `numLines`; `index` not `idx`
- **Include type info when needed**: `urlString` not just `string` if ambiguity exists

## Memory Management

- Swift uses ARC (Automatic Reference Counting) — no manual memory management
- **Retain cycles**: break with `weak` or `unowned` references
```swift
class MyClass {
    var closure: (() -> Void)?
    
    func setup() {
        // [weak self] prevents retain cycle
        closure = { [weak self] in
            self?.doSomething()
        }
    }
}
```
- `weak`: nullable, use when the referenced object may be deallocated
- `unowned`: non-nullable, use only when you're certain the object outlives the reference
