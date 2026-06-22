---
name: flutter-architecture
description: Flutter Clean Architecture with flutter_bloc, freezed, GoRouter, Dio, isar_community, dependency injection, functional error handling, and testing patterns
---

# Flutter Architecture

## Architecture: Clean Layers + BLoC

Keep features organized by capability, then split each feature into presentation, domain, and data layers.

```text
lib/
  core/
    di/
    error/
    network/
    routing/
    storage/
  features/
    orders/
      presentation/
        bloc/
        pages/
        widgets/
      domain/
        entities/
        repositories/
        use_cases/
      data/
        data_sources/
        dto/
        mappers/
        repositories/
```

Dependency direction must stay inward:

```text
Presentation (Flutter widgets, BLoC, GoRouter)
    -> Domain (entities, repository contracts, use cases, failures)
Data (Dio, Isar, DTOs, repository implementations)
    -> Domain
Core (DI, network, storage, error utilities)
    -> used by outer layers without creating cycles
```

## Clean Architecture Rules

- Domain must not import Flutter, Dio, Isar, Firebase, or generated persistence models.
- Repository contracts live in domain; implementations live in data.
- Use cases expose one focused action and return explicit success/failure types.
- DTOs and local models must be mapped into domain entities before reaching presentation.
- Do not leak transport errors, API JSON, Isar collections, or Firebase details into UI state.

## State Management — flutter_bloc + freezed

Use `flutter_bloc` for presentation state and `freezed` for immutable events/states.

```dart
@freezed
sealed class OrdersEvent with _$OrdersEvent {
  const factory OrdersEvent.started() = OrdersStarted;
  const factory OrdersEvent.refreshed() = OrdersRefreshed;
}

@freezed
sealed class OrdersState with _$OrdersState {
  const factory OrdersState.initial() = OrdersInitial;
  const factory OrdersState.loading() = OrdersLoading;
  const factory OrdersState.empty() = OrdersEmpty;
  const factory OrdersState.loaded(List<Order> orders) = OrdersLoaded;
  const factory OrdersState.failure(OrderFailure failure) = OrdersFailure;
}

class OrdersBloc extends Bloc<OrdersEvent, OrdersState> {
  OrdersBloc(this._getOrders) : super(const OrdersState.initial()) {
    on<OrdersStarted>(_onStarted);
    on<OrdersRefreshed>(_onStarted);
  }

  final GetOrders _getOrders;

  Future<void> _onStarted(
    OrdersEvent event,
    Emitter<OrdersState> emit,
  ) async {
    emit(const OrdersState.loading());
    final result = await _getOrders();
    result.match(
      (failure) => emit(OrdersState.failure(failure)),
      (orders) => emit(orders.isEmpty ? const OrdersState.empty() : OrdersState.loaded(orders)),
    );
  }
}
```

Use `BlocSelector` for narrow rebuilds, `BlocListener` for one-off effects, and `MultiBlocProvider` only at composition boundaries.

## Functional Error Handling — fpdart

Use `Either`, `TaskEither`, and `Option` to make failures explicit across repositories and use cases.

```dart
class GetOrders {
  const GetOrders(this._repository);

  final OrdersRepository _repository;

  TaskEither<OrderFailure, List<Order>> call() => _repository.getOrders();
}
```

Throw only at infrastructure boundaries when required by an SDK, then convert to domain failures before returning to domain or presentation.

## Models — freezed DTOs, Entities, Use Cases

- Use `freezed` for immutable domain entities and use-case input/result models when they carry structured data.
- Use `freezed` + `json_serializable` for API DTOs.
- Keep mapping functions explicit and tested.
- Prefer value equality from generated models over hand-written equality.

## Navigation — go_router

Centralize route definitions and guards. Widgets should navigate by named routes or typed helpers, not scattered string URLs.

```dart
final router = GoRouter(
  routes: [
    GoRoute(
      name: 'home',
      path: '/',
      builder: (_, __) => const HomePage(),
    ),
    GoRoute(
      name: 'order-detail',
      path: '/orders/:id',
      builder: (_, state) => OrderDetailPage(
        orderId: state.pathParameters['id']!,
      ),
    ),
  ],
);
```

## Networking — Dio

Use `Dio` for HTTP with typed clients/data sources, interceptors, timeouts, auth headers, and consistent error mapping.

```dart
final dio = Dio(BaseOptions(
  baseUrl: 'https://api.example.com',
  connectTimeout: const Duration(seconds: 10),
  receiveTimeout: const Duration(seconds: 10),
  headers: {'Content-Type': 'application/json'},
));

dio.interceptors.add(AuthInterceptor(tokenService));
```

Map `DioException` into data-layer exceptions or domain failures; never pass raw `DioException` into UI state.

## Local Storage — isar_community

Use `isar_community` for structured local storage, offline cache, and read-through/write-through data sources.

- Keep Isar collection models in the data layer.
- Map Isar objects to domain entities before returning from repositories.
- Keep sensitive values in `flutter_secure_storage`, not Isar.
- Make cache invalidation rules explicit in repositories or dedicated cache policies.

## Dependency Injection — get_it + injectable

Use `get_it` as the service locator and `injectable` for generated registration.

- Register data sources, repositories, use cases, BLoCs, Dio clients, storage clients, and Crashlytics adapters.
- Use environment annotations for dev/test/prod differences.
- Keep manual registration only for objects that cannot be generated cleanly.
- Regenerate DI after constructor or annotation changes.

## Error Recording — Firebase Crashlytics

Record unexpected production errors with `firebase_crashlytics` at application boundaries.

- Forward `FlutterError.onError` and platform dispatcher errors during app bootstrap.
- Record unexpected data/network failures after converting them to user-safe failures.
- Do not use Crashlytics as a replacement for UI error state or test assertions.
- Disable or mock Crashlytics in unit tests.

## Code Generation — build_runner

Run code generation whenever generated dependencies change:

```bash
dart run build_runner build --delete-conflicting-outputs
```

Use codegen for `freezed`, `json_serializable`, `isar_community`, `injectable`, and `mockito` test mocks.

## Testing — flutter_test + mockito

- Unit test use cases, mappers, repositories, and BLoCs.
- Widget test pages and key interaction flows.
- Golden-test widgets with meaningful visual states using `alchemist` (see flutter-platform → Golden tests); commit CI goldens.
- Use `mockito` for class/function collaborators in unit tests.
- Prefer fake data sources for broader repository tests when behavior matters more than call verification.
- Keep generated mocks current with `build_runner`.

## Widget Philosophy

Everything in Flutter is a widget. Widgets are immutable and should rebuild cheaply.

```dart
class UserCard extends StatelessWidget {
  const UserCard({super.key, required this.user});

  final User user;

  @override
  Widget build(BuildContext context) => Card(child: Text(user.name));
}
```

## Review Checklist

- [ ] Feature follows `presentation/domain/data` layering with inward dependencies.
- [ ] Domain imports no Flutter, Dio, Isar, Firebase, or generated persistence code.
- [ ] BLoC events/states are immutable and modeled with `freezed`.
- [ ] DTOs, entities, and use-case models are immutable where appropriate.
- [ ] Repository/use-case results use `fpdart` success/failure types.
- [ ] `go_router` owns route definitions and guards.
- [ ] `Dio` errors are mapped before leaving data boundaries.
- [ ] Isar models remain in data and are mapped to domain entities.
- [ ] Dependencies are registered through `get_it` + `injectable`.
- [ ] Crashlytics records unexpected production errors without hiding UI failures.
- [ ] Generated files are current after `build_runner`.
- [ ] Widget and unit tests cover acceptance criteria with `mockito` where useful.
