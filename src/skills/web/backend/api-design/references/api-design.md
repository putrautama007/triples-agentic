---
name: api-design
description: REST and GraphQL API design conventions — URL structure, versioning, pagination, filtering, and documentation
---

# API Design

## REST URL Conventions

- Use plural nouns for resources: `/users`, `/orders`, `/products`
- Lowercase, hyphen-separated: `/user-profiles`, not `/UserProfiles`
- Nested resources for clear ownership: `/users/:id/orders`
- Query params for filtering/sorting: `/products?category=electronics&sort=price_asc`
- Avoid verbs in URLs (the HTTP method IS the verb): `POST /orders` not `POST /createOrder`

## Versioning

- URL versioning: `/api/v1/users` — simple, explicit, cacheable
- Header versioning: `Accept: application/vnd.myapp.v1+json` — cleaner URLs, harder to test
- **Default**: URL versioning for public APIs

## Pagination

**Cursor-based** (preferred for large/live datasets):
```json
{
  "data": [...],
  "pagination": { "nextCursor": "eyJpZCI6MTAwfQ==", "hasMore": true }
}
```

**Offset-based** (simpler for small, stable datasets):
```json
{
  "data": [...],
  "pagination": { "page": 1, "pageSize": 20, "total": 450 }
}
```

## Filtering & Sorting

```
GET /products?category=electronics&minPrice=100&maxPrice=500
GET /users?sort=created_at:desc,name:asc
GET /orders?status=pending,processing
```

## GraphQL Conventions

```graphql
type User {
  id: ID!
  email: String!
  orders(first: Int, after: String): OrderConnection!
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
}
```

- Use Relay connection pattern for paginated lists
- Mutations take `input` objects, return `payload` objects
- Use `!` for non-nullable fields; nullable is the default

## API Documentation

Every endpoint needs:
- Description, method, URL, headers, path/query params
- Request body (with types and examples)
- All response status codes with body shapes
- A real request/response pair as example

Tools: **OpenAPI 3.x (Swagger)** for REST, **GraphQL Playground** for GraphQL.
