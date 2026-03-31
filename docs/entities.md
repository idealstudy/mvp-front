# entities.md — Entities Structure

Each domain follows this structure:

```
entities/{domain}/
  infrastructure/
    {domain}.dto.ts         — Raw API response types
    {domain}.repository.ts  — All API calls and transformation logic
    {domain}.keys.ts        — TanStack Query keys
  core/
    {domain}.domain.ts      — Domain schema (only when transformation is needed)
  types/
    index.ts                — Final UI-ready types exported to consumers
```

---

## DTO and Domain

DTOs represent raw API responses.
Choose one of the two approaches below based on whether transformation is needed.

### Approach 1 — No transformation

Do NOT create a domain schema.
Export the type directly from the DTO in `types/index.ts`.

```ts
// types/index.ts
export type UnreadCount = z.infer<typeof dto.unreadCount>;
```

### Approach 2 — With transformation

Step 1. Define a pure schema in `core/{domain}.domain.ts`.
Shape only — do NOT import DTO inside domain.ts.

```ts
// core/{domain}.domain.ts
const NotificationSchema = z.object({
  id: z.number(),
  message: z.string(),
  categoryKorean: z.string(),
  relativeTime: z.string(),
  isRead: z.boolean(),
});
```

Step 2. Write transformation logic in `{domain}.repository.ts`, not in domain.ts.

```ts
// infrastructure/{domain}.repository.ts
const toDomain = (raw: z.infer<typeof dto.notification>): Notification => ...;
```

---

## Dependency Direction

Dependency must always flow in this direction. Do not reverse.

Step 1. infrastructure (dto, repository)
Step 2. core (domain)
Step 3. types/index.ts
Step 4. UI components (features)

---

## Rules

Rule 1. Do NOT export DTO types outside the repository.
`types/index.ts` must always export the final UI-ready type only.

Rule 2. `domain.ts` must NOT import from infrastructure.
Correct direction: infrastructure → core.

Rule 3. UI components must always consume types from `types/index.ts`,
regardless of whether transformation occurred.

Rule 4. Do NOT modify existing patterns (`FrontendXxx`, `XxxDTO` exports).
When fixing bugs, follow the surrounding code's conventions.

---

## Repository Implementation Pattern

Parse all API responses with `unwrapEnvelope`.

```ts
import { unwrapEnvelope } from '@/shared/lib/api-utils';

const response = await api.private.get('/endpoint');
return unwrapEnvelope(response, dto.schema);
```

---

## TanStack Query Keys

All query keys must be defined in `{domain}.keys.ts`.
Do NOT write query keys inline in hooks.

```ts
// DO NOT
useQuery({ queryKey: ['notification', 'list'] });

// DO
useQuery({ queryKey: notificationKeys.list() });
```
