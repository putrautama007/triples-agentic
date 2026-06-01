---
name: flutter-architecture
description: Flutter architecture with Riverpod, widget composition, GoRouter navigation, and state management patterns
---

# Flutter Architecture

## Architecture: Riverpod + Clean Layers

```
UI Layer (Widgets)
    ↕ ref.watch / Consumer
Riverpod Provider (state + business logic)
    ↕ Repository interface
Data Layer (API, Local DB, Cache)
```

## Widget Philosophy

Everything in Flutter is a widget. Widgets are immutable — they rebuild cheaply.

```dart
// Stateless: no mutable state
class UserCard extends StatelessWidget {
  const UserCard({super.key, required this.user});
  final User user;

  @override
  Widget build(BuildContext context) => Card(child: Text(user.name));
}
```

## Riverpod — State Management

```dart
// AsyncNotifier for complex state
class OrdersNotifier extends AsyncNotifier<List<Order>> {
  @override
  Future<List<Order>> build() =>
      ref.read(orderRepoProvider).fetchOrders();

  Future<void> placeOrder(OrderRequest request) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(orderRepoProvider).place(request),
    );
  }
}

final ordersProvider =
    AsyncNotifierProvider<OrdersNotifier, List<Order>>(OrdersNotifier.new);

// Simple FutureProvider
final userProvider = FutureProvider.family<User, String>(
  (ref, userId) => ref.read(userRepoProvider).fetchUser(userId),
);
```

## Navigation — GoRouter

```dart
final router = GoRouter(
  routes: [
    GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
    GoRoute(
      path: '/user/:id',
      builder: (ctx, state) =>
          UserScreen(userId: state.pathParameters['id']!),
    ),
  ],
);
```

## Networking — Dio

```dart
final dio = Dio(BaseOptions(
  baseUrl: 'https://api.example.com',
  headers: {'Content-Type': 'application/json'},
));

dio.interceptors.add(AuthInterceptor(tokenService));

Future<User> fetchUser(String id) async {
  final response = await dio.get('/users/$id');
  return User.fromJson(response.data as Map<String, dynamic>);
}
```
