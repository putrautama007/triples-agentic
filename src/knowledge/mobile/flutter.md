# Flutter Development Knowledge

## Architecture

Use **BLoC (Business Logic Component)** or **Riverpod** for state management in production Flutter apps:

```
UI Layer (Widgets)
    ↕ StreamBuilder / BlocBuilder / Consumer
BLoC / Provider / Notifier (state + business logic)
    ↕ Repository interface
Data Layer (API, Local DB, Cache)
```

For simpler apps, **Riverpod + StateNotifier** is sufficient and less boilerplate than BLoC.

## Widget Philosophy

Everything in Flutter is a widget. Widgets are immutable descriptions of the UI — they rebuild cheaply.

```dart
// Stateless: no mutable state
class UserCard extends StatelessWidget {
  const UserCard({super.key, required this.user});
  final User user;

  @override
  Widget build(BuildContext context) {
    return Card(child: Text(user.name));
  }
}

// Stateful: local mutable state only
class CounterWidget extends StatefulWidget {
  const CounterWidget({super.key});
  @override
  State<CounterWidget> createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _count = 0;
  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: () => setState(() => _count++),
      child: Text('Count: $_count'),
    );
  }
}
```

## State Management — Riverpod (Recommended)

```dart
// Provider definition
final userProvider = FutureProvider.family<User, String>((ref, userId) async {
  final repo = ref.read(userRepositoryProvider);
  return repo.fetchUser(userId);
});

// AsyncNotifier for complex state
class OrdersNotifier extends AsyncNotifier<List<Order>> {
  @override
  Future<List<Order>> build() => ref.read(orderRepoProvider).fetchOrders();

  Future<void> placeOrder(OrderRequest request) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => ref.read(orderRepoProvider).place(request));
  }
}

final ordersProvider = AsyncNotifierProvider<OrdersNotifier, List<Order>>(OrdersNotifier.new);
```

## Navigation — GoRouter (Recommended)

```dart
final router = GoRouter(
  routes: [
    GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
    GoRoute(
      path: '/user/:id',
      builder: (context, state) => UserScreen(userId: state.pathParameters['id']!),
    ),
  ],
);
```

## Material 3 / Cupertino

- Use Material 3 widgets for Android-first or cross-platform apps
- Use Cupertino widgets for iOS-native feel
- `ThemeData.useMaterial3 = true` — required for Material 3
- `ColorScheme.fromSeed(seedColor: ...)` for dynamic color palette
- Always handle dark mode: `brightness: Brightness.dark`

## Network Layer

```dart
// Dio for HTTP (preferred over http package for complex needs)
final dio = Dio(BaseOptions(
  baseUrl: 'https://api.example.com',
  headers: {'Content-Type': 'application/json'},
));

// Add interceptors for auth
dio.interceptors.add(AuthInterceptor(tokenService));

// Usage
Future<User> fetchUser(String id) async {
  final response = await dio.get('/users/$id');
  return User.fromJson(response.data);
}
```

## Local Storage

- **Hive** or **Isar**: fast NoSQL local DB for structured data
- **SQLite via drift (moor)**: relational local data
- **SharedPreferences / flutter_secure_storage**: key-value (use secure storage for tokens)
- **path_provider**: get platform-appropriate file paths

## Platform-Specific Code

When Flutter doesn't cover a native feature, use platform channels:
```dart
// Dart side
const platform = MethodChannel('com.example.app/biometrics');
final result = await platform.invokeMethod<bool>('authenticate');
```

Or use existing plugins from `pub.dev` — check:
1. Pub points (quality score)
2. Last published date
3. Platform support (Android/iOS/Web checkboxes)

## Performance

- `const` constructor everywhere possible — prevents unnecessary rebuilds
- `RepaintBoundary` around complex widgets that change independently
- `ListView.builder` / `GridView.builder` for long lists (lazy rendering)
- Avoid `setState` at the top of the widget tree — keep state low
- Profile with Flutter DevTools (Timeline, Widget Rebuilds)

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

// Integration test (runs on device)
// test_driver/ + integration_test/ directories
```

## Publishing

- **Android**: build AAB (`flutter build appbundle --release`)
- **iOS**: archive via Xcode (`flutter build ios --release`)
- Version format: `version: 1.0.0+1` in `pubspec.yaml` (name+build number)
- Icon generation: `flutter_launcher_icons` package
- Splash screen: `flutter_native_splash` package
