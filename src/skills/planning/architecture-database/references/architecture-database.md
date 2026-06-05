---
name: architecture-database
description: Database selection guide, scalability checklist, and observability stack for production systems
---

# Architecture — Database & Scalability

## Database Selection Guide

| Need | Recommended | Why |
|---|---|---|
| Relational data, ACID transactions | PostgreSQL | Industry standard, excellent tooling |
| Simple key-value cache | Redis | Fast, well-supported |
| Document storage, flexible schema | MongoDB | Schema flexibility, good horizontal scaling |
| Full-text search | Elasticsearch / Meilisearch | Built for search |
| Time-series data | TimescaleDB / InfluxDB | Efficient for append-heavy, time-indexed data |
| Graph relationships | Neo4j | Native graph traversal |

**Default to PostgreSQL** unless there is a specific, documented reason not to.

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
- **Alerting**: page on error rate spikes and latency degradation — not on CPU%

## Background Jobs

Use queues (BullMQ, Sidekiq, Celery) for:
- Email/notification sending
- File processing
- External API calls with retries
- Report generation

Every job must: log start/end, handle errors gracefully, be idempotent (safe to retry).
