---
name: android-platform
description: Android Material Design 3, local storage, background work, testing, and Play Store requirements
---

# Android — Platform & Distribution

## Material Design 3

- Use MD3 components (`Button`, `Card`, `TextField`, `TopAppBar`, `NavigationBar`)
- Color roles: `primary`, `secondary`, `tertiary`, `error`, `surface`, `background`
- Dynamic color (Material You): supported on Android 12+ with `dynamicColorScheme()`
- Always support dark mode from day one: `isSystemInDarkTheme()`
- Use `dp` for all dimensions, never hardcode pixel values

## Local Storage

| Use case | Solution |
|---|---|
| Structured relational data | Room |
| Simple settings (non-sensitive) | DataStore (Preferences) |
| Sensitive data (tokens) | EncryptedSharedPreferences |
| Complex typed settings | DataStore (Proto) |
| Binary files, documents | FileManager |

Never use SharedPreferences for sensitive data.

## Background Work

- **WorkManager** — guaranteed background tasks (syncs, uploads, notifications scheduling)
- **Coroutines + Dispatchers.IO** — async I/O on demand within the app lifecycle
- Never do network/disk I/O on `Dispatchers.Main` (UI thread)

```kotlin
viewModelScope.launch(Dispatchers.IO) {
    val result = repository.fetchData()
    withContext(Dispatchers.Main) { _uiState.update { it.copy(data = result) } }
}
```

## Testing

- **Unit tests**: ViewModel + use cases — JUnit 5, Turbine (Flow testing), Mockk
- **UI tests**: Composable testing with `ComposeTestRule`
- **Integration tests**: Room in-memory database; Retrofit MockWebServer

## Performance

- Profile with Android Studio Profiler (CPU, Memory, Network tabs)
- Use `LazyColumn` / `LazyRow` for large lists — never `Column` + scroll for dynamic data
- Avoid object allocation in Composable functions (causes GC pressure)
- Minimize recompositions: stable types, `remember`, `derivedStateOf`

## Play Store Requirements

- Target latest stable `targetSdkVersion` (within one year of release)
- 64-bit support required
- Privacy declarations for all permissions and data collected
- App Bundle (`.aab`) format required for new apps
- Content rating questionnaire must be completed
