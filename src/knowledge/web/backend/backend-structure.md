---
name: backend-structure
description: Backend project structure, API response conventions, database best practices, and error handling patterns
---

# Backend — Structure & Conventions

## Core Principles

1. **Reliability over cleverness.** Boring code that works beats clever code that surprises you at 3am.
2. **Fail explicitly.** Return specific error codes and messages. Never silently swallow errors.
3. **Idempotency.** Design operations that can be safely retried.
4. **Defense in depth.** Validate at the API layer AND at the database layer.

## Project Structure (Layered)

```
src/
├── api/          # Route handlers (HTTP layer only — no business logic)
│   └── routes/
├── services/     # Business logic (pure functions where possible)
├── repositories/ # Database access (single source of truth for queries)
├── models/       # Data models / schemas / types
├── middleware/   # Auth, logging, rate limiting, error handling
├── utils/        # Pure utility functions
└── config/       # Environment configuration
```

## API Response Conventions

```json
// Success
{ "data": { ... }, "meta": { "page": 1, "total": 100 } }

// Error
{ "error": { "code": "VALIDATION_ERROR", "message": "Email is required", "field": "email" } }
```

### Status Codes
- `200 OK` — successful GET/PATCH
- `201 Created` — successful POST (include `Location` header)
- `204 No Content` — successful DELETE
- `400 Bad Request` — invalid data (include field-level errors)
- `401 Unauthorized` — missing or invalid authentication
- `403 Forbidden` — authenticated but not authorized
- `404 Not Found` — resource doesn't exist
- `409 Conflict` — duplicate resource or state conflict
- `422 Unprocessable Entity` — failed business rule validation
- `429 Too Many Requests` — rate limit hit (include `Retry-After` header)
- `500 Internal Server Error` — never expose stack traces in production

## Database Best Practices

- **Migrations**: every schema change is a migration file (never edit production schema manually)
- **Transactions**: wrap multi-step operations that must succeed or fail together
- **Indexes**: index foreign keys, columns used in WHERE/ORDER BY, and unique constraints
- **N+1 prevention**: use joins or batch loading — never query in a loop
- **Soft deletes**: `deleted_at TIMESTAMP` instead of hard DELETE for auditable data
- **Timestamps**: every table has `created_at` and `updated_at` (auto-managed)

## Error Handling

```typescript
// Centralized error handler (Express)
app.use((err, req, res, next) => {
  logger.error({ err, correlationId: req.id, method: req.method, url: req.url });

  if (err instanceof ValidationError) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', ...err.details } });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: err.message } });
  }
  return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } });
});
```

Never expose stack traces or internal error messages to clients in production.
