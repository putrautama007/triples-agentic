---
name: dart-async
description: Dart async/await, Future, Stream, error handling, mixins, and extension methods
---

# Dart — Async, Streams & Advanced Patterns

## Future — One-time async value

```dart
Future<User> fetchUser(String id) async {
  final response = await http.get(Uri.parse('/users/$id'));
  return User.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
}

// Error handling
try {
  final user = await fetchUser(id);
  print(user.name);
} on SocketException {
  throw NetworkException('No internet connection');
} catch (e) {
  rethrow;  // preserve stack trace
}
```

## Stream — Sequence of async values

```dart
Stream<List<Message>> watchMessages(String roomId) {
  return firestore
      .collection('messages')
      .where('roomId', isEqualTo: roomId)
      .snapshots()
      .map((snap) => snap.docs.map(Message.fromDoc).toList());
}

// Consuming a stream
await for (final messages in watchMessages(roomId)) {
  updateUI(messages);
}
```

## FutureBuilder & StreamBuilder (Flutter widgets)

```dart
FutureBuilder<User>(
  future: fetchUser(userId),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const CircularProgressIndicator();
    }
    if (snapshot.hasError) return Text('Error: ${snapshot.error}');
    return Text(snapshot.data!.name);
  },
)
```

Prefer Riverpod's `AsyncNotifier` over `FutureBuilder` in new code — it handles caching and state more cleanly.

## Mixins

```dart
mixin Serializable {
  Map<String, dynamic> toJson();
  String toJsonString() => jsonEncode(toJson());
}

class User with Serializable {
  final String name;
  User(this.name);
  @override
  Map<String, dynamic> toJson() => {'name': name};
}
```

## Extension Methods

```dart
extension StringExtension on String {
  String get titleCase =>
      split(' ').map((w) => w[0].toUpperCase() + w.substring(1)).join(' ');
}

// Usage
'hello world'.titleCase  // 'Hello World'

extension ListExtension<T> on List<T> {
  T? firstWhereOrNull(bool Function(T) test) {
    try { return firstWhere(test); } catch (_) { return null; }
  }
}
```
