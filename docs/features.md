# features.md — Features Structure

Each feature follows this structure:

```
features/{feature}/
  components/   — UI components
  hooks/        — Custom hooks and state management
```

---

## Responsibilities

The features layer is responsible for:

- UI components
- Custom hooks
- State management

The features layer is NOT responsible for:

- API calls — these must always be implemented in `entities/{domain}/infrastructure/`

---

## Rules

Rule 1. New features must only contain `components/` and `hooks/`.
Add other directories only when there is a clear reason.

Rule 2. Do NOT place API calls inside `features`.
All API calls belong in `entities/{domain}/infrastructure/{domain}.repository.ts`.

Rule 3. Do NOT modify existing directories (`api/`, `model/`, `service/`, `lib/`).
These are from an older architecture — leave them as-is.
When fixing bugs inside them, follow the surrounding code's conventions.
