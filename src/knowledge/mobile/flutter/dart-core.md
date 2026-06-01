---
name: dart-core
description: Dart null safety, core types, classes and constructors, enums, and idiomatic collection operations
---

# Dart — Core Language

## Null Safety

```dart
String name = 'Alice';   // Non-nullable
String? nickname;         // Nullable

// Null-aware operators
String display = nickname ?? 'No nickname';   // fallback
int? length = nickname?.length;               // safe access
nickname ??= 'Default';                       // assign if null
String definite = nickname!;                  // assert non-null (throws if null)
```

## Core Types

```dart
int age = 25;
double price = 9.99;
bool isActive = true;
String name = 'Alice';

List<String> tags = ['flutter', 'dart'];   // immutable
Set<int> ids = {1, 2, 3};
Map<String, dynamic> data = {'name': 'Alice', 'age': 25};

// Const — compile-time constants
const pi = 3.14159;
const colors = ['red', 'green', 'blue'];
```

## Classes & Constructors

```dart
class User {
  final String id;
  final String email;
  String name;

  // Named constructor with initializer list
  User({required this.id, required this.email, required this.name});

  // Named constructor
  User.anonymous() : id = '', email = '', name = 'Guest';

  // Factory constructor
  factory User.fromJson(Map<String, dynamic> json) {
    return User(id: json['id'], email: json['email'], name: json['name']);
  }

  // copyWith pattern
  User copyWith({String? name}) =>
      User(id: id, email: email, name: name ?? this.name);
}
```

## Enhanced Enums (Dart 2.17+)

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
PaymentStatus.completed.label  // 'Completed'
PaymentStatus.completed.color  // Colors.green
```

## Functional Collections

```dart
final activeAdults = users
    .where((u) => u.isActive && u.age >= 18)
    .map((u) => UserSummary(u.id, u.name))
    .toList();

final total = orders.fold(0.0, (sum, order) => sum + order.total);
```

## Dart Style

- `lowerCamelCase` for variables/functions, `UpperCamelCase` for classes
- Prefer `final` over `var`; `const` over `final` where possible
- Format with `dart format` (built-in, no Prettier needed)
- Lint with `flutter_lints` or `very_good_analysis`
