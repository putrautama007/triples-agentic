---
name: swift-concurrency
description: Swift async/await, structured concurrency, actors, protocols, generics, and memory management (ARC)
---

# Swift — Concurrency & Advanced Patterns

## async/await

```swift
// Async function
func fetchUser(id: String) async throws -> User {
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}

// Calling async code
Task {
    do {
        let user = try await fetchUser(id: "123")
        await MainActor.run { self.user = user }
    } catch { print("Error: \(error)") }
}

// Parallel execution
async let userFetch = fetchUser(id: userId)
async let ordersFetch = fetchOrders(userId: userId)
let (user, orders) = try await (userFetch, ordersFetch)
```

## @MainActor

UI updates must happen on the main actor:

```swift
@MainActor
func updateUI(with user: User) {
    self.nameLabel.text = user.name  // safe on main thread
}

// ViewModel marked as @MainActor
@MainActor
class ProfileViewModel: ObservableObject {
    @Published var user: User?
    func load() async { user = try? await userRepo.fetch() }
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
```

## Memory Management (ARC)

- ARC manages memory automatically — no manual `malloc`/`free`
- **Retain cycles**: break with `weak` or `unowned` in closures

```swift
class MyClass {
    var closure: (() -> Void)?

    func setup() {
        closure = { [weak self] in  // prevents retain cycle
            self?.doSomething()
        }
    }
}
```

- `weak`: nullable, use when referenced object may be deallocated
- `unowned`: non-nullable, use only when certain the object outlives the reference

## Mixins (Protocol Extensions)

```swift
protocol Serializable {
    func toJson() -> [String: Any]
}

extension Serializable {
    func toJsonString() -> String {
        (try? JSONSerialization.data(withJSONObject: toJson())).flatMap {
            String(data: $0, encoding: .utf8)
        } ?? "{}"
    }
}
```
