---
name: backend-security
description: Backend security — JWT auth patterns, RBAC, input validation, parameterized queries, and structured logging
---

# Backend — Security & Observability

## Authentication Pattern (JWT)

```
1. Client sends credentials → POST /auth/login
2. Server validates → returns { access_token, refresh_token }
3. Client sends: Authorization: Bearer <access_token>
4. Server validates JWT signature + expiry on every request
5. Refresh via POST /auth/refresh with refresh_token
```

- **Access tokens**: short-lived (15–60 min)
- **Refresh tokens**: long-lived (7–30 days), stored httpOnly cookie
- Never store JWTs in localStorage (XSS risk)
- Validate signature AND expiry on every protected route

## RBAC Authorization

```
User → has Role(s) → Role has Permissions → Permission gates resources/actions
```

- Check authorization in the **service layer**, not the route handler
- Never pass user-controlled values as part of the authorization check
- Use allowlists, not denylists

## Input Validation

- Validate ALL inputs at the API boundary before processing
- Use parameterized queries or ORM — never string concatenation in SQL
- Validate content type, file size, and MIME type for uploads
- Schema validation library: Zod (TypeScript), Pydantic (Python), Joi (Node.js)

```typescript
// Validate at the boundary
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});
const body = schema.parse(req.body); // throws if invalid
```

## Structured Logging

```typescript
logger.info({
  event: 'user.login',
  userId: user.id,
  correlationId: req.id,
  ip: req.ip,
  durationMs: Date.now() - startTime,
});
```

Log levels:
- `debug` — dev only, verbose internal state
- `info` — normal operations (requests, business events)
- `warn` — unexpected but handled (retry succeeded, fallback used)
- `error` — needs investigation (unhandled exception, external failure)

**Never log**: passwords, tokens, full credit card numbers, PII in plain text.

## Rate Limiting

```typescript
// Express rate-limit example
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);
```

- Apply stricter limits to auth endpoints (`POST /auth/login`)
- Return `429 Too Many Requests` with `Retry-After` header
- Consider IP-based and user-based limits separately
