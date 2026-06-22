---
name: flutter-platform
description: Flutter Material 3, local storage, platform channels, performance, testing, and publishing for Android and iOS
---

# Flutter — Platform & Distribution

## Material 3 Theming

```dart
MaterialApp(
  theme: ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
  ),
  darkTheme: ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.indigo,
      brightness: Brightness.dark,
    ),
  ),
)
```

## Local Storage

| Use case | Package |
|---|---|
| Structured data | Hive or Isar |
| Relational data | drift (SQLite) |
| Simple key-value | shared_preferences |
| Sensitive data (tokens) | flutter_secure_storage |
| Files | path_provider |

Never store credentials in SharedPreferences.

## Platform Channels (when Flutter doesn't cover a native feature)

```dart
const platform = MethodChannel('com.example.app/biometrics');
final bool result = await platform.invokeMethod<bool>('authenticate') ?? false;
```

Prefer existing pub.dev packages before writing platform channels. Check:
1. Pub points (quality score)
2. Last published date
3. Platform support (Android/iOS/Web checkboxes)

## Performance

- `const` constructor everywhere possible — prevents unnecessary rebuilds
- `ListView.builder` / `GridView.builder` for long lists (lazy rendering)
- Avoid `setState` high in the widget tree — keep state low
- Profile with Flutter DevTools (Timeline, Widget Rebuilds inspector)
- `RepaintBoundary` around complex widgets that change independently

## Testing

```dart
// Widget test
testWidgets('shows user name', (tester) async {
  await tester.pumpWidget(const MaterialApp(home: UserCard(user: mockUser)));
  expect(find.text(mockUser.name), findsOneWidget);
});

// Unit test
test('formats currency correctly', () {
  expect(formatCurrency(1234.56), '\$1,234.56');
});
```

### Golden (visual) tests — Alchemist

Use [`alchemist`](https://pub.dev/packages/alchemist) for widget golden tests — it wraps `flutter_test` goldens with multi-scenario groups and deterministic CI rendering. Add it to `dev_dependencies`.

```dart
import 'package:alchemist/alchemist.dart';

void main() {
  goldenTest(
    'UserCard renders',
    fileName: 'user_card',
    builder: () => GoldenTestGroup(
      children: [
        GoldenTestScenario(name: 'default', child: UserCard(user: mockUser)),
        GoldenTestScenario(name: 'long name', child: UserCard(user: longNameUser)),
      ],
    ),
  );
}
```

Alchemist produces two golden flavors: **CI goldens** (`goldens/ci/`, no real fonts/shadows — deterministic, committed and asserted on CI) and **platform goldens** (`goldens/<platform>/`, real text rendering — local only). Configure once in `test/flutter_test_config.dart`:

```dart
Future<void> testExecutable(FutureOr<void> Function() testMain) =>
    AlchemistConfig.runWithConfig(
      config: AlchemistConfig(
        platformGoldensConfig: PlatformGoldensConfig(enabled: !isRunningInCi),
      ),
      run: testMain,
    );
```

- Regenerate after intentional UI changes: `flutter test --update-goldens`; review the image diff before committing.
- One golden per widget state that matters (loading / empty / error / filled) — golden tests complement, not replace, behavioral widget tests.
- Load real fonts in the test config so text isn't boxes; keep widgets pinned to fixed sizes/data for stable diffs.

## Publishing

- **Android**: `flutter build appbundle --release` → `.aab`
- **iOS**: `flutter build ios --release` → archive via Xcode
- Version: `version: 1.0.0+1` in `pubspec.yaml` (semantic version + build number)
- Icons: `flutter_launcher_icons` package
- Splash screen: `flutter_native_splash` package
