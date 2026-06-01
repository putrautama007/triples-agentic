---
name: android-architecture
description: Android MVVM + Clean Architecture, Jetpack Compose patterns, Hilt DI, and Navigation Compose
---

# Android Architecture

## Architecture Pattern: MVVM + Clean Architecture

```
UI Layer (Composable)
    ↕ StateFlow / collect
ViewModel (state holder, no Android dependencies)
    ↕ suspend functions / Flow
Repository (single data access layer)
    ↕ API / Room / DataStore
```

## Jetpack Compose Rules

- Composables are stateless by default — pass state down, events up
- Use `remember` for UI-only ephemeral state (not business state)
- Hoist state to the lowest common ancestor that needs it
- Break large composables into smaller ones: if it doesn't fit on one screen, split it

```kotlin
// Correct: stateless composable + hoisted state in ViewModel
@Composable
fun LoginScreen(
    uiState: LoginUiState,
    onEmailChanged: (String) -> Unit,
    onLoginClick: () -> Unit,
) { ... }

// Only at screen entry points (top-level routes)
@Composable
fun LoginRoute(viewModel: LoginViewModel = hiltViewModel()) {
    LoginScreen(
        uiState = viewModel.uiState.collectAsState().value,
        onEmailChanged = viewModel::onEmailChanged,
        onLoginClick = viewModel::login,
    )
}
```

## Dependency Injection — Hilt

- `@HiltAndroidApp` on Application class
- `@AndroidEntryPoint` on Activities/Fragments that use injection
- `@HiltViewModel` for ViewModels
- Scopes: `@Singleton` for app-wide, `@ActivityScoped` for per-screen

## Navigation — Navigation Compose

```kotlin
// Define routes as a sealed hierarchy
sealed class Screen(val route: String) {
    object Login : Screen("login")
    data class Profile(val userId: String) : Screen("profile/{userId}")
}

// NavHost setup
NavHost(navController, startDestination = Screen.Login.route) {
    composable(Screen.Login.route) { LoginRoute(navController) }
    composable("profile/{userId}") { backStackEntry ->
        ProfileRoute(userId = backStackEntry.arguments?.getString("userId")!!)
    }
}
```

Navigate from ViewModel using a sealed event/effect — never hold NavController in ViewModel.

## Network — Retrofit + OkHttp

```kotlin
@GET("users/{id}")
suspend fun getUser(@Path("id") id: String): UserDto

// Add logging interceptor for debug builds only
if (BuildConfig.DEBUG) {
    addInterceptor(HttpLoggingInterceptor().apply { level = BODY })
}
```
