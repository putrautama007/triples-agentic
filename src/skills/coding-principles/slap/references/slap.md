---
name: slap
description: SLAP (Single Level of Abstraction Principle) — each function should operate at a single level of abstraction
---

# SLAP — Single Level of Abstraction Principle

Each function should operate at a single level of abstraction.

```
// Bad — mixes high-level orchestration with low-level detail
function processOrder(order) {
  validateOrder(order);
  const sql = `INSERT INTO orders (id, total) VALUES (${order.id}, ${order.total})`;
  db.execute(sql);
  sendEmail(order.user.email, 'Order confirmed');
}

// Good — consistent abstraction level
function processOrder(order) {
  validateOrder(order);
  saveOrder(order);
  notifyUser(order);
}
```

- If one line calls a named function and the next line contains raw SQL or DOM manipulation, the abstraction levels are mismatched
- Extract lower-level details into well-named helpers to restore consistency
- Consistent abstraction levels make a function readable top-to-bottom without context switches
