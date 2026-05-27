# AGENTS.md — AI Coding Agent Guidelines

This is the entry point for all AI coding agents working in this repository.
Read this file first before touching any code.

---

## Required Reading

Read the following files **in order** before writing any code.
All files are located in the `docs/` folder.

| Order | File                            | What it covers                                            |
| ----- | ------------------------------- | --------------------------------------------------------- |
| 1     | `docs/architecture.md`          | FSD architecture, layer structure, data flow, API clients |
| 2     | `docs/entities.md`              | Entities structure                                        |
| 3     | `docs/features.md`              | Features structure, notes on existing legacy code         |
| 4     | `docs/error-handling.md`        | Error handling layers, ApiErrorType, usage examples       |
| 5     | `docs/e2e.md`                   | Playwright setup, rules, and key flows for E2E testing    |
| 6     | `docs/frontend-guidelines.md`   | Page structure, color tokens, naming, component reuse     |

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

### 6. Prefer skill patterns over legacy implementations

Existing legacy implementations may not follow the latest architecture rules.

For newly generated code:

- Prefer `.ai/skills/*` patterns
- Do not copy legacy implementation patterns into new files

### 7. Validate generated code before completion

Before finishing any implementation, always run:

```bash
bash .ai/hooks/ai-check.sh
```

If the check fails, read `.ai/tmp/diagnostics.json`, fix all `severity: "error"` items, and re-run until passed.

### 8. Do not access secrets or environment files

AI agents must not read, print, create, or modify `.env`, `.env.*`, tokens, credentials, or secret values.

When a task requires credentials:

- Use existing environment variable names only
- Do not hardcode secret values
- If verification requires unavailable secrets, report the limitation and use mock or fixture-based validation where possible
- Do not read or modify `.env.local`
- Use `.env.example` to understand which environment variables exist
- Modify `.env.example` only when explicitly requested

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

IF you are writing new UI components or pages:
→ Read `docs/frontend-guidelines.md`

IF you are unfamiliar with the codebase or the task spans multiple areas:
→ Read all files in order (see Required Reading above)

---

## AI Harness

For repetitive tasks, read the corresponding skill file and follow its steps exactly.

| Task                                                                | Skill                                   |
| ------------------------------------------------------------------- | --------------------------------------- |
| Create full CRUD for a new domain (DTO → keys → repository → types) | `.ai/skills/create-crud-flow.md`        |
| Create a POST / PUT / PATCH / DELETE mutation hook                  | `.ai/skills/create-post-mutation.md`    |
| Create a form + mutation flow (RHF + useMutation, error handling)   | `.ai/skills/create-form-mutation.md`    |
| Create a GET query hook (useQuery, queryKey, repository, enabled)   | `.ai/skills/create-query-hook.md`       |
| Add error handling to a mutation `onError`                          | `.ai/skills/handle-api-error.md`        |
| Create a modal (open state, confirm/cancel, ESC/backdrop, loading)  | `.ai/skills/create-modal.md`            |
| Create an editor feature (TextEditor/TextViewer, content save/view) | `.ai/skills/create-editor-feature.md`   |

Workflows (orchestrate multiple skills in sequence):

| Situation                 | Workflow                            |
| ------------------------- | ----------------------------------- |
| New domain CRUD requested | `.ai/workflows/crud_requested.yaml` |

Reference example (complete CRUD output for a real-like domain):

| Example                        | File                          |
| ------------------------------ | ----------------------------- |
| notice 도메인 CRUD 전체 산출물 | `.ai/examples/crud-notice.md` |

Run the layer violation check after any generation:

```bash
bash .ai/hooks/ai-check.sh
```

---

## AI Workflow Rules

IF creating a new domain CRUD:
→ Read `.ai/skills/create-crud-flow.md` first
→ Follow the order: DTO → keys → repository → types
→ After generation, run `bash .ai/hooks/ai-check.sh`

IF creating a query hook:
→ Read `.ai/skills/create-query-hook.md` first
→ `queryKey` must use key factory — no array literals
→ `queryFn` must call repository — no direct `api.private` / `api.public`
→ Add `enabled` when id or condition may be absent

IF creating a mutation hook:
→ Read `.ai/skills/create-post-mutation.md`
→ `onSuccess` must call `invalidateQueries`
→ Error handling location depends on usage:
   - form mutation: no hook `onError`; handle in component `mutate(data, { onError })`
     → Read `.ai/skills/create-form-mutation.md`
   - non-form mutation: hook `onError` must call `handleApiError`

IF adding error handling:
→ Read `.ai/skills/handle-api-error.md`
→ Add `classifyXxxError` to `src/shared/lib/errors/errors.ts` — never in a separate file

IF the guardrail check fails:
→ Read console output for a human-readable summary
→ Read `.ai/tmp/diagnostics.json` for machine-readable violation details
→ Find `severity: "error"` items — only these cause exit 1
→ Fix each violation using `ruleId` + `file` + `line` as the target
→ Read `docs[]` links in the failing diagnostic before modifying
→ Apply **minimal patch only** — do not refactor surrounding code
→ Re-run `bash .ai/hooks/ai-check.sh` to verify

Notes:

- `warning` / `info` items do NOT cause failure — fix is optional
- Prefer reading `.ai/examples/crud-notice.md` or skill files before rewriting
- See `docs/ai-diagnostics.md` for full schema reference
