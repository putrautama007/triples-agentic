# Backend Development Knowledge

## Core Principles

1. **Reliability over cleverness.** Boring code that works beats clever code that surprises you at 3am.
2. **Fail explicitly.** Return specific error codes and messages. Never silently swallow errors.
3. **Idempotency.** Design operations that can be safely retried. This saves you in distributed systems.
4. **Defense in depth.** Validate at the API layer AND at the database layer. Never trust one guard.

## Project Structure (Layered)

```
src/
├── api/          # Route handlers (HTTP layer only — no business logic here)
│   └── routes/
├── services/     # Business logic (pure functions where possible)
├── repositories/ # Database access (single source of truth for queries)
├── models/       # Data models / schemas / types
├── middleware/   # Auth, logging, rate limiting, error handling
├── utils/        # Pure utility functions
└── config/       # Environment configuration
```

## API Design

### RESTful Endpoints
```
GET    /resources          → list (paginated)
GET    /resources/:id      → single resource
POST   /resources          → create
PUT    /resources/:id      → replace (full update)
PATCH  /resources/:id      → partial update
DELETE /resources/:id      → delete
```

### Response Shape Conventions
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
- `400 Bad Request` — client sent invalid data (include field-level errors)
- `401 Unauthorized` — missing or invalid authentication
- `403 Forbidden` — authenticated but not authorized for this action
- `404 Not Found` — resource doesn't exist
- `409 Conflict` — duplicate resource or state conflict
- `422 Unprocessable Entity` — valid JSON but failed business rule validation
- `429 Too Many Requests` — rate limit hit (include `Retry-After` header)
- `500 Internal Server Error` — never expose stack traces in production

## Authentication & Authorization

### JWT Authentication
```
1. Client sends credentials → POST /auth/login
2. Server validates → returns { access_token, refresh_token }
3. Client sends: Authorization: Bearer <access_token>
4. Server validates JWT signature + expiry on every request
5. Refresh via POST /auth/refresh with refresh_token
```

- Access tokens: short-lived (15–60 min)
- Refresh tokens: long-lived (7–30 days), stored httpOnly cookie
- Never store JWTs in localStorage (XSS risk)

### RBAC (Role-Based Access Control)
```
User → has Role(s) → Role has Permissions → Permission gates resources/actions
```
Check authorization in the service layer, not the route handler.

## Database Best Practices

- **Migrations**: every schema change is a migration file (never edit production schema manually)
- **Transactions**: wrap multi-step operations that must succeed or fail together
- **Indexes**: index foreign keys, columns used in WHERE/ORDER BY, and unique constraints
- **N+1 prevention**: use joins or batch loading (DataLoader pattern) — never query in a loop
- **Soft deletes**: `deleted_at TIMESTAMP` instead of hard DELETE for auditable data
- **Timestamps**: every table has `created_at` and `updated_at` (auto-managed)

## Error Handling

```javascript
// Centralized error handler (Express example)
app.use((err, req, res, next) => {
  logger.error({ err, req: { method: req.method, url: req.url, correlationId: req.id } });
  
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', ...err.details } });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: err.message } });
  }
  // Never expose stack traces to clients
  return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } });
});
```

## Background Jobs

Use queues (BullMQ, Sidekiq, Celery) for:
- Email/notification sending
- File processing
- External API calls with retries
- Report generation

Every job must: log start/end, handle errors gracefully, be idempotent (safe to retry).

## Logging

```javascript
// Structured logging — always include correlation ID
logger.info({
  event: 'user.created',
  userId: user.id,
  correlationId: req.id,
  durationMs: Date.now() - startTime,
});
```

Log levels: `debug` (dev only) → `info` (normal operations) → `warn` (unexpected but handled) → `error` (needs investigation)

Never log: passwords, tokens, PII in plain text, full request bodies.
