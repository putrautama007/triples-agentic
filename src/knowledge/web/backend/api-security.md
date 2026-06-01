---
name: api-security
description: API security — authentication headers, CORS policy, rate limiting, deprecation policy, and client error handling
---

# API Security & Lifecycle

## Authentication

- **Bearer token** (JWT): `Authorization: Bearer <token>` — stateless, works for mobile and web
- **API Key**: `Authorization: ApiKey <key>` or `X-Api-Key: <key>` — for service-to-service
- Always HTTPS — never send credentials over plain HTTP
- Return `401 Unauthorized` for missing/invalid token, `403 Forbidden` for insufficient permissions

## CORS

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400
```

- **Never** `Access-Control-Allow-Origin: *` for authenticated APIs
- Whitelist specific origins per environment
- Preflight requests (`OPTIONS`) must respond with `204 No Content`

## Rate Limiting Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1735689600
Retry-After: 60
```

Always tell the client when they can retry.

## Versioning & Deprecation Policy

1. Introduce new field/endpoint alongside old one
2. Mark old field as `deprecated` in schema / docs
3. Announce deprecation with a removal date (minimum 6 months notice)
4. Monitor usage before removal; don't remove when still used
5. Remove only when usage is zero or all clients have migrated

## Client Error Handling Rules

- Always handle `401` by clearing auth state and redirecting to login
- Implement exponential backoff for `429` and `503` responses
- Cache responses where appropriate (`Cache-Control` header from server)
- Use request cancellation to avoid race conditions in search/autocomplete
- Never retry `400`/`422` (client errors) — fix the request instead
- Log all 5xx responses on the client side for debugging
