# API Design Knowledge

## API Design Principles

1. **Contract first.** Define the API before writing implementation. Clients and servers evolve independently.
2. **Stable over clever.** Breaking changes cost clients dearly. Prefer additive changes.
3. **Consistent over convenient.** Follow your naming conventions even when a one-off would be shorter.
4. **Self-documenting.** A well-designed API requires minimal documentation because it's predictable.

## REST API Conventions

### URL Design
- Use plural nouns for resources: `/users`, `/orders`, `/products`
- Lowercase, hyphen-separated: `/user-profiles`, not `/UserProfiles` or `/user_profiles`
- Nested resources for clear ownership: `/users/:id/orders` (orders owned by a user)
- Query params for filtering/sorting: `/products?category=electronics&sort=price_asc`
- Avoid verbs in URLs (the HTTP method IS the verb): `POST /orders` not `POST /createOrder`

### Versioning
- URL versioning: `/api/v1/users` — simple, explicit, cacheable
- Header versioning: `Accept: application/vnd.myapp.v1+json` — cleaner URLs, harder to test
- Default to URL versioning for public APIs

### Pagination
Cursor-based (preferred for large/live datasets):
```json
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJpZCI6MTAwfQ==",
    "hasMore": true
  }
}
```
Offset-based (simpler for small, stable datasets):
```json
{
  "data": [...],
  "pagination": { "page": 1, "pageSize": 20, "total": 450 }
}
```

### Filtering & Sorting
```
GET /products?category=electronics&minPrice=100&maxPrice=500
GET /users?sort=created_at:desc,name:asc
GET /orders?status=pending,processing   (multi-value)
```

## GraphQL Conventions

### Schema Design
```graphql
type User {
  id: ID!
  email: String!
  name: String!
  orders(first: Int, after: String): OrderConnection!
  createdAt: DateTime!
}

type Query {
  user(id: ID!): User
  users(first: Int, after: String, filter: UserFilter): UserConnection!
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!
}
```

### Conventions
- Use Relay connection pattern for paginated lists
- Mutations take `input` objects, return `payload` objects
- Use `!` for non-nullable fields; nullable is the default
- Enums for fixed sets of values
- Scalars: `DateTime` (ISO 8601), `URL`, `EmailAddress`

## API Documentation

Every API endpoint needs:
- **Description**: what does this endpoint do?
- **Request**: method, URL, headers, path params, query params, request body (with types)
- **Response**: status codes, response body shape, error responses
- **Example**: real request/response pair

Tools: OpenAPI 3.x (Swagger) for REST, GraphQL Playground / GraphiQL for GraphQL.

## API Security

- **Authentication**: Bearer token (JWT) or API Key in `Authorization` header
- **Rate limiting**: per-user or per-IP; return `429` with `Retry-After` header
- **Input validation**: validate ALL inputs at the API boundary before processing
- **CORS**: whitelist specific origins; never `Access-Control-Allow-Origin: *` for authenticated APIs
- **Sensitive data**: never return passwords, full payment card numbers, or unhashed tokens in responses

## Versioning & Deprecation Policy

1. Introduce new field/endpoint alongside old one
2. Mark old field as `deprecated` in schema / docs
3. Announce deprecation with a removal date (minimum 6 months notice)
4. Monitor usage of deprecated endpoint before removal
5. Remove only when usage is zero or all clients have migrated

## API Client Conventions (for Mobile/Frontend consumers)

- Always handle `401` by clearing auth state and redirecting to login
- Implement exponential backoff for `429` and `503` responses
- Cache responses where appropriate (`Cache-Control` header)
- Use request cancellation to avoid race conditions in search/autocomplete
- Never retry `400`/`422` (client errors) — fix the request instead
