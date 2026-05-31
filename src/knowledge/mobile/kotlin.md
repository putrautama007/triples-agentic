# Kotlin Language Knowledge

## Language Philosophy

Kotlin prioritizes: null safety, conciseness, and interoperability with Java. Write idiomatic Kotlin, not Java translated to Kotlin syntax.

## Null Safety

```kotlin
// Nullable type explicitly declared
var name: String? = null

// Safe call — returns null instead of NPE
val length = name?.length

// Elvis operator — provide fallback
val displayName = name ?: "Anonymous"

// Non-null assertion — use only when you are certain (throws NPE if null)
val definiteLength = name!!.length  // avoid unless truly necessary

// Let for null-checking scope
name?.let { nonNullName ->
    println("Name is: $nonNullName")
}
```

## Data Classes

```kotlin
data class User(
    val id: String,
    val email: String,
    val name: String,
)
// Auto-generates: equals(), hashCode(), toString(), copy()
```

## Sealed Classes & When

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

// Exhaustive when (no else needed for sealed classes)
when (result) {
    is Result.Success -> showData(result.data)
    is Result.Error -> showError(result.exception)
    is Result.Loading -> showSpinner()
}
```

## Extension Functions

```kotlin
fun String.toTitleCase(): String = 
    split(" ").joinToString(" ") { word -> 
        word.replaceFirstChar { it.uppercase() }
    }

// Usage: "hello world".toTitleCase() → "Hello World"
```

## Coroutines

```kotlin
// Launch fire-and-forget coroutine
viewModelScope.launch {
    val result = repository.fetchUser(id)  // suspend function
    _uiState.update { it.copy(user = result) }
}

// Async/await for parallel execution
val (userDeferred, ordersDeferred) = awaitAll(
    async { repository.fetchUser(id) },
    async { repository.fetchOrders(id) }
)

// Flow for streams
val userFlow: Flow<User> = repository.observeUser(id)

viewModelScope.launch {
    userFlow
        .map { user -> user.toUiModel() }
        .catch { e -> handleError(e) }
        .collect { uiModel -> _uiState.update { it.copy(user = uiModel) } }
}
```

## Collections

```kotlin
// Prefer immutable by default
val names: List<String> = listOf("Alice", "Bob")
val nameSet: Set<String> = setOf("Alice", "Bob")
val scores: Map<String, Int> = mapOf("Alice" to 95, "Bob" to 87)

// Mutable when mutation is needed
val mutableNames = mutableListOf("Alice")
mutableNames.add("Bob")

// Functional operations
val activeAdultUsers = users
    .filter { it.isActive && it.age >= 18 }
    .map { UserSummary(it.id, it.name) }
    .sortedBy { it.name }
    .take(10)
```

## Scope Functions

| Function | Context object | Return value | Use when |
|---|---|---|---|
| `let` | `it` | Lambda result | Null checks, transforming result |
| `run` | `this` | Lambda result | Object configuration + compute result |
| `with` | `this` | Lambda result | Multiple calls on same object |
| `apply` | `this` | Context object | Object initialization/configuration |
| `also` | `it` | Context object | Side effects (logging, validation) |

## Idiomatic Kotlin Rules

- Prefer `val` over `var` — immutability by default
- Prefer `data class` over plain class for DTOs and models
- Use `object` for singletons, not companion object with private constructor
- Named arguments for functions with 3+ parameters
- `when` over chained `if/else if`
- String templates over concatenation: `"Hello, $name!"` not `"Hello, " + name + "!"`
- Trailing lambda syntax for higher-order functions: `run { ... }` not `run({ ... })`
