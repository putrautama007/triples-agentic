---
name: architecture-security
description: Security fundamentals for system design — authentication, authorization, secrets management, and input validation
---

# Architecture — Security Fundamentals

## Authentication

- **JWT**: stateless APIs; access token (15–60 min) + refresh token (7–30 days, httpOnly cookie)
- **Session cookies**: server-rendered apps with stateful sessions
- Never store JWTs in localStorage (XSS risk)

```
1. Client sends credentials → POST /auth/login
2. Server validates → returns { access_token, refresh_token }
3. Client sends: Authorization: Bearer <access_token>
4. Server validates JWT signature + expiry on every request
5. Refresh via POST /auth/refresh with refresh_token
```

## Authorization

### RBAC (Role-Based Access Control)
```
User → has Role(s) → Role has Permissions → Permission gates resources/actions
```
Check authorization in the service layer, not the route handler.

### ABAC (Attribute-Based Access Control)
Use only for complex policy requirements where RBAC becomes unmanageable.

## Secrets Management

- **Never** commit secrets to version control
- Use environment variables + secrets manager (HashiCorp Vault, AWS SSM, GCP Secret Manager)
- Rotate secrets on a schedule; immediately on suspected leak
- Different secrets per environment (dev/staging/prod)

## Input Validation

- Validate and sanitize **at the API boundary** — never trust client input
- Use parameterized queries or ORMs — never string concatenation in SQL
- Validate content type, size, and shape before processing files/uploads
- Sanitize HTML output; never use `innerHTML` with user content

## Transport Security

- **HTTPS everywhere**: TLS 1.2 minimum; TLS 1.3 preferred
- Redirect all HTTP to HTTPS; enforce with HSTS header
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

## Common Vulnerabilities to Prevent

| Vulnerability | Prevention |
|---|---|
| SQL Injection | Parameterized queries / ORM |
| XSS | Escape output; CSP headers; never innerHTML with user data |
| CSRF | SameSite cookies + CSRF tokens for state-changing operations |
| Sensitive data exposure | Encrypt at rest and in transit; never log PII or tokens |
| Broken access control | Enforce authorization server-side on every request |
