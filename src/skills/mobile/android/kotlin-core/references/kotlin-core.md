---
name: kotlin-core
description: Kotlin null safety, data classes, sealed classes, extension functions, and idiomatic collection operations
---

# Kotlin — Core Language

## Null Safety

```kotlin
// Nullable type explicitly declared
var name: String? = null

// Safe call — returns null instead of NPE
val length = name?.length

// Elvis operator — provide fallback
val displayName = name ?: "Anonymous"

// Non-null assertion — only when truly certain
val definiteLength = name!!.length  // avoid unless necessary

// Let for null-checking scope
name?.let { nonNullName ->
    println("Name: $nonNullName")
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
val updated = user.copy(name = "New Name")
```

## Sealed Classes & When

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

// Exhaustive when — no else needed
when (result) {
    is Result.Success -> showData(result.data)
    is Result.Error   -> showError(result.exception)
    is Result.Loading -> showSpinner()
}
```

## Extension Functions

```kotlin
fun String.toTitleCase(): String =
    split(" ").joinToString(" ") { it.replaceFirstChar { c -> c.uppercase() } }

// Usage: "hello world".toTitleCase() → "Hello World"
```

## Collections

```kotlin
val names: List<String> = listOf("Alice", "Bob")   // immutable
val mutableNames = mutableListOf("Alice")           // mutable

// Functional operations
val activeAdultUsers = users
    .filter { it.isActive && it.age >= 18 }
    .map { UserSummary(it.id, it.name) }
    .sortedBy { it.name }
    .take(10)
```

## Idiomatic Kotlin Rules

- Prefer `val` over `var` — immutability by default
- Prefer `data class` over plain class for DTOs and models
- Use `object` for singletons
- Named arguments for functions with 3+ parameters
- `when` over chained `if/else if`
- String templates over concatenation: `"Hello, $name!"` not `"Hello, " + name + "!"`
