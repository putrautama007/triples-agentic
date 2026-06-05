---
name: kotlin-concurrency
description: Kotlin coroutines, Flow, scope functions, and async/await patterns for Android development
---

# Kotlin — Coroutines & Concurrency

## Coroutines Basics

```kotlin
// Launch fire-and-forget
viewModelScope.launch {
    val result = repository.fetchUser(id)  // suspend function
    _uiState.update { it.copy(user = result) }
}

// Async/await for parallel execution
val (user, orders) = awaitAll(
    async { repository.fetchUser(id) },
    async { repository.fetchOrders(id) }
)
```

## Flow

```kotlin
// Cold stream — executes per collector
val userFlow: Flow<User> = repository.observeUser(id)

viewModelScope.launch {
    userFlow
        .map { user -> user.toUiModel() }
        .catch { e -> handleError(e) }
        .collect { uiModel -> _uiState.update { it.copy(user = uiModel) } }
}

// StateFlow — hot, always has a value
private val _uiState = MutableStateFlow(LoginUiState())
val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()
```

## Dispatchers

| Dispatcher | Use for |
|---|---|
| `Dispatchers.Main` | UI updates, collect StateFlow |
| `Dispatchers.IO` | Network, file, database operations |
| `Dispatchers.Default` | CPU-intensive work (parsing, sorting large lists) |

Never block the Main dispatcher.

## Scope Functions

| Function | Context | Returns | Use when |
|---|---|---|---|
| `let` | `it` | Lambda result | Null checks, transforming result |
| `run` | `this` | Lambda result | Object configuration + compute |
| `with` | `this` | Lambda result | Multiple calls on same object |
| `apply` | `this` | Context object | Object initialization |
| `also` | `it` | Context object | Side effects (logging) |

## Error Handling in Coroutines

```kotlin
viewModelScope.launch {
    try {
        val result = repository.fetchData()
        _uiState.update { it.copy(data = result, error = null) }
    } catch (e: HttpException) {
        _uiState.update { it.copy(error = "Network error: ${e.message}") }
    } catch (e: CancellationException) {
        throw e  // always rethrow CancellationException
    }
}
```
