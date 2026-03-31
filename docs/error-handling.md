# Error Handling

## Overview

Error handling is split into two layers:

| Layer                       | Scope               | Who handles it                       |
| --------------------------- | ------------------- | ------------------------------------ |
| Interceptor (`api.private`) | Network / 5xx / 401 | Automatic — no component code needed |
| Mutation `onError`          | 4xx business errors | Developer — use `handleApiError`     |

---

## Layer 1 — Interceptor (Automatic)

`api.private` automatically handles the following:

- Network errors
- 5xx server errors
- 401 unauthorized errors

**Behavior:** shows a toast message and redirects to `/login` when necessary.

> ✅ Do NOT add manual error handling in components for these cases.

---

## Layer 2 — Mutation Business Errors (4xx)

Handle 4xx errors inside the mutation's `onError` callback using `handleApiError`.

### Error Classification Flow

```
AxiosError
  → getApiError()         // extracts { code, message }
  → classifyXxxError(code) // maps code → ApiErrorType
  → handleApiError()      // executes the matching handler
```

### ApiErrorType

| Type      | Meaning                               | Default Action                   |
| --------- | ------------------------------------- | -------------------------------- |
| `FIELD`   | User input is invalid                 | Show error in form, stay on page |
| `CONTEXT` | Resource not found or page is invalid | Redirect to list page            |
| `AUTH`    | No permission or re-auth required     | Redirect to `/login`             |
| `UNKNOWN` | Any other unexpected error            | Handle as needed                 |

---

## Standard Usage

### Step 1 — Add a classify function

Add `classifyXxxError` to `src/shared/lib/errors/errors.ts`:

```ts
// src/shared/lib/errors/errors.ts
export function classifyXxxError(code: string): ApiErrorType {
  switch (code) {
    case 'XXX_NOT_FOUND':
      return ApiErrorType.CONTEXT;
    case 'XXX_FORBIDDEN':
      return ApiErrorType.AUTH;
    case 'XXX_INVALID_INPUT':
      return ApiErrorType.FIELD;
    default:
      return ApiErrorType.UNKNOWN;
  }
}
```

### Step 2 — Call `handleApiError` in `onError`

```ts
onError: (error) => {
  handleApiError(error, classifyXxxError, {
    onField:   (msg) => setError('root', { message: msg }),
    onContext: ()    => setTimeout(() => router.replace('/list'), 1500),
    onAuth:    ()    => setTimeout(() => router.replace('/login'), 1500),
    onUnknown: ()    => {},
  });
},
```

---

## Checklist — Adding a New Domain Error

- [ ] `classifyXxxError` added in `src/shared/lib/errors/errors.ts`
- [ ] `handleApiError` called in the mutation `onError`
- [ ] `onField` sets form error and keeps the user on the page
- [ ] `onContext` redirects to the list page
- [ ] `onAuth` redirects to `/login`
- [ ] No manual handling of 5xx / 401 / network errors in components
