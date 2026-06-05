---
name: web-security
description: Web security — CSP, HTTPS/HSTS, XSS prevention, CSRF protection, and Subresource Integrity
---

# Web Security

## Content Security Policy (CSP)

Block inline scripts and unauthorized origins:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:
```

- Never use `'unsafe-inline'` for scripts in production
- Use nonces for inline scripts that cannot be moved to external files
- Report violations with `Content-Security-Policy-Report-Only` before enforcing

## HTTPS & Transport Security

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

- Enforce HTTPS at the load balancer; never serve on HTTP
- Register for HSTS preload at hstspreload.org for maximum protection

## XSS Prevention

- Never use `innerHTML`, `outerHTML`, or `document.write` with user content
- Use `textContent` for text nodes
- Sanitize HTML with DOMPurify when rich HTML input is required
- React, Vue, Angular escape by default — use their escape hatches (`dangerouslySetInnerHTML`) only with pre-sanitized content

## CSRF Protection

- Use `SameSite=Lax` or `SameSite=Strict` cookies for session tokens
- Add CSRF tokens to all state-changing form submissions
- Double-submit cookie pattern for stateless CSRF protection

## Subresource Integrity (SRI)

Add `integrity` attributes to third-party scripts and styles:

```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-abc123..."
        crossorigin="anonymous"></script>
```

## Third-Party Scripts

- Audit every third-party script — each is a potential XSS vector
- Load analytics, chat widgets, etc. with `async` and in a sandboxed context
- Regularly audit what third-party scripts have access to (use browser devtools)
