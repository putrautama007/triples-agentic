# RFC: [Feature / System Name]

**Author:** YooYeon (Staff Engineer)
**Status:** Draft | Under Review | Approved | Superseded
**Date:** YYYY-MM-DD
**Version:** 1.0
**Related PRD:** workspace/prd/PRD-{slug}.md

---

## Summary

> One paragraph: what is being built, using what approach, and the key trade-off explicitly accepted.

---

## Motivation

Why is this being built now? What problem does it solve that current systems cannot address? Reference the PRD problem statement.

---

## Technical Proposal

### Architecture Overview

```
[ASCII diagram or description of how components interact]

Client → API Gateway → [Service A] → [Database]
                    ↘ [Service B] → [Cache]
```

### Data Model

```sql
-- Key tables / schemas / collections

CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- [Additional entities...]
```

### API Contracts

```
POST /api/v1/[resource]
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "field": "value"
}

Response 201:
{
  "data": {
    "id": "uuid",
    "field": "value",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}

Response 400:
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "field is required",
    "field": "field"
  }
}
```

### Key Algorithms / Business Logic

> Describe any non-trivial logic that needs design attention: pricing calculations, state machines, rate limiting, etc.

### Infrastructure & Deployment

- **Hosting:** [Cloud provider, region, service type]
- **Scaling:** [How does this scale under load?]
- **Observability:** [Logs, metrics, traces — what is instrumented?]
- **Environment config:** [Environment variables required]

---

## Alternatives Considered

### Alternative 1: [Name]
**Description:** What was this approach?
**Rejected because:** [Specific reason — not just "worse"]

### Alternative 2: [Name]
**Description:** What was this approach?
**Rejected because:** [Specific reason]

---

## Trade-offs & Risks

| Trade-off / Risk | Impact | Mitigation |
|-----------------|--------|------------|
| [What we give up or what could go wrong] | High/Med/Low | [How we mitigate] |
| [Trade-off] | High/Med/Low | [Mitigation] |

---

## Migration Plan

> If this changes existing behavior or data: how do existing users/data get migrated?

1. [Migration step]
2. [Migration step]
3. [Verification step]

---

## Rollout Plan

- **Feature flag:** [flag name — yes/no and rollout strategy]
- **Phased rollout:** [e.g., 1% → 10% → 100% with monitoring gates]
- **Rollback procedure:** [How to undo this change if it goes wrong]
- **Go-live checklist:**
  - [ ] Database migration run and verified
  - [ ] Feature flag configured
  - [ ] Monitoring dashboards set up
  - [ ] Runbook updated

---

## Open Questions

| # | Question | Owner | Due Date |
|---|----------|-------|---------|
| 1 | [Unresolved technical question] | [Person] | [Date] |

---

## References

- [Link to PRD: workspace/prd/PRD-{slug}.md]
- [External documentation, standards, or prior RFCs]

---

## Update History

| Version | Date | Changed By | Summary |
|---------|------|------------|---------|
| 1.0 | YYYY-MM-DD | YooYeon | Initial draft |
