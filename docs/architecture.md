# architecture.md — Project Architecture

This project follows an FSD-style layered architecture.

---

## Data Flow

Calls must always flow in this direction. Do not skip or reverse layers.

Step 1. UI (features)
Step 2. domain (entities/core)
Step 3. repository (entities/infrastructure)
Step 4. api client (shared/api)
Step 5. backend

---

## API Clients

Use `api.public` for requests that do not require authentication.
Use `api.private` for requests that require authentication — access token is attached automatically.

DO NOT use `api.bff.client` or `api.bff.server` — these are deprecated and must not be used in new code.

---

## Rules

Rule 1. API calls must NOT be placed inside `features`.
Rule 2. All API calls must be implemented at `entities/{domain}/infrastructure/{domain}.repository.ts`.
