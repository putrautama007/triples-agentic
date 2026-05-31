# Dart Language Knowledge

## Language Principles

Dart is strongly typed, null-safe, and optimized for UI. It compiles to native ARM/x86 code (mobile) and JavaScript (web). Sound null safety is enforced by the compiler.

## Null Safety

```dart
// Non-nullable by default
String name = 'Alice'; // cannot be null

// Nullable with ?
String? nickname; // can be null

// Null assertion (throws if null — use sparingly)
String definiteNickname = nickname!;

// Null-aware operators
String display = nickname ?? 'No nickname';  // fallback
int? length = nickname?.length;              // safe access
nickname ??= 'Default';                      // assign if null
```

## Core Types

```dart
// Primitives
int age = 25;
double price = 9.99;
bool isActive = true;
String name = 'Alice';

// Collections (immutable by default)
List<String> tags = ['flutter', 'dart'];
Set<int> ids = {1, 2, 3};
Map<String, dynamic> data = {'name': 'Alice', 'age': 25};

// Const (compile-time constants)
const pi = 3.14159;
const colors = ['red', 'green', 'blue'];
```

## Classes & Constructors

```dart
class User {
  final String id;
  final String email;
  String name;

  // Generative constructor with initializer list
  User({required this.id, required this.email, required this.name});

  // Named constructor
  User.anonymous() : id = '', email = '', name = 'Guest';

  // Factory constructor (returns instance, may return existing)
  factory User.fromJson(Map<String, dynamic> json) {
    return User(id: json['id'], email: json['email'], name: json['name']);
  }

  // copyWith pattern
  User copyWith({String? name}) => User(id: id, email: email, name: name ?? this.name);

  Map<String, dynamic> toJson() => {'id': id, 'email': email, 'name': name};
}
```

## Async / Future / Stream

```dart
// Future — one-time async value
Future<User> fetchUser(String id) async {
  final response = await http.get(Uri.parse('/users/$id'));
  return User.fromJson(jsonDecode(response.body));
}

// Stream — sequence of async values
Stream<List<Message>> watchMessages(String roomId) {
  return firestore.collection('messages')
      .where('roomId', isEqualTo: roomId)
      .snapshots()
      .map((snap) => snap.docs.map(Message.fromDoc).toList());
}

// Error handling
try {
  final user = await fetchUser(id);
} on SocketException {
  throw NetworkException('No internet connection');
} catch (e) {
  rethrow;
}
```

## Functional Collection Operations

```dart
final users = [User(id: '1', name: 'Alice'), User(id: '2', name: 'Bob')];

// map
final names = users.map((u) => u.name).toList(); // ['Alice', 'Bob']

// filter
final active = users.where((u) => u.isActive).toList();

// reduce
final total = orders.fold(0.0, (sum, order) => sum + order.total);

// sort (returns new list in Dart via sorted extension, or sort in-place)
final sorted = [...users]..sort((a, b) => a.name.compareTo(b.name));

// Spread and collection-if
final adminItems = [
  ...baseItems,
  if (isAdmin) const AdminDashboardItem(),
];
```

## Mixins & Extensions

```dart
// Mixin — share behavior without inheritance
mixin Serializable {
  Map<String, dynamic> toJson();
  
  String toJsonString() => jsonEncode(toJson());
}

class User with Serializable {
  @override
  Map<String, dynamic> toJson() => {'name': name};
}

// Extension — add methods to existing types
extension StringExtension on String {
  String get titleCase =>
      split(' ').map((w) => w[0].toUpperCase() + w.substring(1)).join(' ');
}

// Usage
'hello world'.titleCase; // 'Hello World'
```

## Enums (Enhanced — Dart 2.17+)

```dart
enum PaymentStatus {
  pending('Pending', Colors.orange),
  completed('Completed', Colors.green),
  failed('Failed', Colors.red);

  const PaymentStatus(this.label, this.color);
  final String label;
  final Color color;
}

// Usage
PaymentStatus.completed.label // 'Completed'
PaymentStatus.completed.color // Colors.green
```

## Dart Style Guide

- Use `lowerCamelCase` for variables and functions, `UpperCamelCase` for classes
- Prefer `final` over `var` when value won't change
- Use `const` wherever possible (compile-time performance)
- Format with `dart format` (built-in formatter — no Prettier needed)
- Lint with `flutter_lints` or `very_good_analysis` package
- Avoid `dynamic` — use generics or sealed classes instead
