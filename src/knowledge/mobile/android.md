# Android Development Knowledge

## Architecture

Use **MVVM + Clean Architecture** for all new Android projects:

```
UI Layer (Composable / Fragment)
    ↕ StateFlow / LiveData
ViewModel Layer (state holder, no Android dependencies)
    ↕ suspend functions / Flow
Domain Layer (use cases — optional for simple apps)
    ↕ Repository interface
Data Layer (Repository implementation, API, Room)
```

## Jetpack Compose (Preferred UI Framework)

### Composable Design Rules
- Composables are stateless by default — pass state down, events up
- Use `remember` for UI-only ephemeral state (not business state)
- Hoist state to the lowest common ancestor that needs it
- Break large composables into smaller ones; if it doesn't fit on one screen of code, split it

```kotlin
// Correct: stateless composable + hoisted state
@Composable
fun LoginScreen(
    uiState: LoginUiState,
    onEmailChanged: (String) -> Unit,
    onLoginClick: () -> Unit,
) { ... }

// Avoid: composable that fetches its own data
@Composable
fun LoginScreen(viewModel: LoginViewModel = hiltViewModel()) { ... } // only at screen entry points
```

### Theming
- Use `MaterialTheme` for all color, typography, and shape
- Define custom colors in `Color.kt`, theme in `Theme.kt`
- Support dark mode from day one (`isSystemInDarkTheme()`)
- Use `dp` for dimensions, never hardcode pixel values

## Dependency Injection — Hilt

- Use `@HiltAndroidApp` on Application class
- `@AndroidEntryPoint` on Activities/Fragments that use injection
- `@HiltViewModel` for ViewModels
- Scopes: `@Singleton` for app-wide, `@ActivityScoped` for per-screen

## Navigation

- **Jetpack Navigation** with type-safe arguments (Navigation Compose)
- Define routes as sealed classes or objects — never raw strings
- Navigate from ViewModel using sealed event/effect, not direct NavController reference

```kotlin
sealed class LoginRoute {
    object Login : LoginRoute()
    data class Home(val userId: String) : LoginRoute()
}
```

## Network Layer

- **Retrofit** + **OkHttp** for HTTP
- **Kotlin Serialization** or **Gson** for JSON parsing (prefer kotlinx.serialization)
- **Flow** for streaming data; **suspend** for one-shot requests
- Add `HttpLoggingInterceptor` for debug builds only

## Local Storage

- **Room** for structured relational data
- **DataStore** (Preferences or Proto) for simple key-value settings (replaces SharedPreferences)
- Encrypt sensitive data with `EncryptedSharedPreferences` or SQLCipher + Room

## Background Work

- **WorkManager** for guaranteed background tasks (syncs, uploads, notifications)
- **Coroutines** with `Dispatchers.IO` for async I/O on demand
- Never do network/disk I/O on `Dispatchers.Main`

## Material Design 3

- Use MD3 components (`Button`, `Card`, `TextField`, `TopAppBar`, `NavigationBar`)
- Color roles: `primary`, `secondary`, `tertiary`, `error`, `surface`, `background`
- Dynamic color (Material You): supported on Android 12+ with `dynamicColorScheme()`

## Testing

- **Unit tests**: ViewModel + use cases — JUnit 5, Turbine (Flow testing), Mockk
- **UI tests**: Composable testing with `ComposeTestRule`; Espresso for View-based
- **Integration tests**: Room in-memory database; Retrofit MockWebServer

## Performance

- Avoid recompositions: use `remember`, stable types, `derivedStateOf`
- Profile with Android Studio Profiler (CPU, Memory, Network tabs)
- Use `LazyColumn` / `LazyRow` for large lists — never `Column` + scroll for dynamic data
- Avoid object allocation in composable functions (causes GC pressure)

## App Store Requirements (Play Store)

- Target latest stable `targetSdkVersion` (within one year of release)
- 64-bit support required
- Privacy declarations for all permissions and data collected
- App Bundle (`.aab`) format required for new apps
- Content rating questionnaire must be completed
