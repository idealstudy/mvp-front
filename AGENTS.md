# AGENTS.md — AI Coding Agent Guidelines

This is the entry point for all AI coding agents working in this repository.
Read this file first before touching any code.

---

## Required Reading

Read the following files **in order** before writing any code.
All files are located in the `docs/` folder.

| Order | File                     | What it covers                                            |
| ----- | ------------------------ | --------------------------------------------------------- |
| 1     | `docs/architecture.md`   | FSD architecture, layer structure, data flow, API clients |
| 2     | `docs/entities.md`       | Entities structure                                        |
| 3     | `docs/features.md`       | Features structure, notes on existing legacy code         |
| 4     | `docs/error-handling.md` | Error handling layers, ApiErrorType, usage examples       |
| 5     | `docs/e2e.md`            | Playwright setup, rules, and key flows for E2E testing    |

> ✅ These 5 files are the only docs that exist in `docs/`. Do not assume other documentation exists.

---

## Rules

### 1. API calls must live in `entities`

Never place API calls inside `features`.
All API calls must be implemented in:

```
entities/{domain}/infrastructure/{domain}.repository.ts
```

### 2. Use TanStack Query for all client-side data fetching

Direct API calls inside Client Components are not allowed without a clear reason.
Always use TanStack Query hooks.

### 3. Use `api.private` or `api.public` only

Do not use deprecated clients in new code:

- ❌ `api.bff.client`
- ❌ `api.bff.server`

### 4. Do not refactor existing code

These guidelines apply to **new code only**.
When fixing bugs, follow the surrounding code's existing conventions.

### 5. Leave a comment when a rule cannot be followed

If any of the above rules cannot be applied, add a comment in the code explaining why.

---

## Quick Reference

Before writing any code, identify your task type below and read the listed files.

IF the task involves adding or modifying an API call:
→ Read `docs/architecture.md`
→ Read `docs/entities.md`

IF the task involves adding or modifying a feature:
→ Read `docs/architecture.md`
→ Read `docs/features.md`

IF the task involves error handling in a mutation:
→ Read `docs/error-handling.md`

IF the task involves writing or modifying E2E tests:
→ Read `docs/e2e.md`

IF you are unfamiliar with the codebase or the task spans multiple areas:
→ Read all 5 files in order (see Required Reading above)
