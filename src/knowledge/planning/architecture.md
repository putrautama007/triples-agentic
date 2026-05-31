# Architecture Knowledge — System Design Patterns

## Foundational Principles

1. **Simple before clever.** A boring, well-understood pattern that works beats an elegant abstraction that surprises the team.
2. **Design for failure.** Every external call can fail. Every database can go down. Design the happy path last.
3. **Defer decisions.** Don't choose a message queue before you know you need one. Premature architecture is technical debt with extra steps.
4. **Observability first.** If you can't measure it, you can't debug it in production.

## Common Architectural Patterns

### Layered (N-Tier)
```
Presentation → Application / Business Logic → Data Access → Storage
```
- Best for: CRUD-heavy applications, well-understood domains
- Trade-off: Layer coupling, hard to scale individual layers

### Event-Driven
```
Producer → Event Bus → Consumer(s)
```
- Best for: Decoupled services, audit trails, async workflows
- Trade-off: Eventual consistency, harder to debug

### Microservices
```
API Gateway → Service A, Service B, Service C (each with own DB)
```
- Best for: Teams that need to deploy independently, mixed tech stacks
- Trade-off: Network overhead, distributed tracing complexity, operational burden

### Monolith (Recommended for v1)
```
Single deployable unit: routes + business logic + DB access
```
- Best for: Early-stage products, small teams, fast iteration
- Trade-off: Harder to scale specific hotspots as traffic grows

### CQRS (Command Query Responsibility Segregation)
```
Write path: Command → Aggregate → Event → Write Store
Read path: Read Store (denormalized views)
```
- Best for: High-read systems with complex reporting needs
- Trade-off: Two models to maintain, eventual consistency

## API Design Patterns

### REST
- Resources are nouns, HTTP verbs define actions
- `GET /users/123` — read; `POST /users` — create; `PATCH /users/123` — update
- Status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error
- Pagination: cursor-based preferred over offset for large datasets

### GraphQL
- Single endpoint, client specifies exact data shape
- Use when: multiple clients (web, mobile) with different data needs
- Avoid when: simple CRUD, team unfamiliar with the overhead

## Database Selection Guide

| Need | Recommended | Why |
|---|---|---|
| Relational data, ACID transactions | PostgreSQL | Industry standard, excellent tooling |
| Simple key-value cache | Redis | Fast, well-supported |
| Document storage, flexible schema | MongoDB | Schema flexibility, good horizontal scaling |
| Full-text search | Elasticsearch / Meilisearch | Built for search |
| Time-series data | TimescaleDB / InfluxDB | Efficient for append-heavy, time-indexed data |
| Graph relationships | Neo4j | Native graph traversal |

Default to **PostgreSQL** unless there is a specific, documented reason not to.

## Security Fundamentals

- **Authentication**: Prefer JWT for stateless APIs; sessions for server-rendered apps
- **Authorization**: RBAC (Role-Based Access Control) for most systems; ABAC for complex policy
- **Secrets management**: Never commit secrets. Use environment variables + secrets manager (Vault, AWS SSM)
- **Input validation**: Validate and sanitize at the API boundary; never trust client input
- **HTTPS everywhere**: TLS 1.2 minimum; redirect all HTTP to HTTPS

## Scalability Checklist

Before designing for scale, verify you actually need it. Then:
- [ ] Stateless application servers (scale horizontally, not vertically)
- [ ] Database read replicas for read-heavy workloads
- [ ] CDN for static assets
- [ ] Caching layer (Redis) for expensive computed results
- [ ] Async queues for long-running tasks
- [ ] Rate limiting at API gateway

## Observability Stack

Every production system needs:
- **Logging**: structured JSON logs, correlation IDs across service calls
- **Metrics**: request rate, error rate, latency (p50/p95/p99)
- **Tracing**: distributed trace IDs through all service hops
- **Alerting**: page on error rate spikes and latency degradation, not on CPU%
