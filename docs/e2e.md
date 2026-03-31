# e2e.md — E2E Testing (Playwright)

---

## Setup

- Test runner: `npx playwright test`
- Config file: `playwright.config.ts`
- Test directory: `e2e/`

---

## Directory Structure

```
e2e/
  fixtures/            — shared login logic and reusable setup
  helpers/             — utility functions
  {feature}.spec.ts    — test files
```

---

## Environment Variables

Test accounts are managed in `.env.local`.
Do NOT hardcode credentials anywhere in test files.

- Teacher account: `E2E_TEACHER_EMAIL` / `E2E_TEACHER_PASSWORD`
- Student account: `E2E_STUDENT_EMAIL` / `E2E_STUDENT_PASSWORD`

---

## Rules

### File and Test Structure

Rule 1. Name test files as `{feature}.spec.ts` (e.g. `login.spec.ts`).
Rule 2. Group related tests with `describe`. Use `test` for individual scenarios.
Rule 3. Add a comment at the top of each test indicating the role being used.

```ts
// teacher account
describe('login', () => {
  test('can log in with email and password', async ({ page }) => {
    ...
  });
});
```

---

### Selectors

Rule 4. Always use `data-testid` attributes as the primary selector.
Do NOT use text or CSS selectors — they break when UI changes.

Naming convention: `{feature}-{element}`

```ts
// DO NOT
page.locator('.login-btn');
page.getByText('로그인');

// DO
page.getByTestId('login-submit-button');
```

Examples: `login-email-input`, `login-password-input`, `login-submit-button`, `course-card`

Rule 5. When writing a test that references a `data-testid`, add the corresponding attribute to the source component as well.
Do NOT reference `data-testid` values that don't exist in the codebase.

---

### Waiting

Rule 6. Do NOT use `waitForTimeout`. Use condition-based waiting only.

```ts
// DO NOT
await page.waitForTimeout(2000);

// DO
await page.waitForURL('/dashboard');
await expect(locator).toBeVisible();
```

---

### Data and Independence

Rule 7. Each test must be independently executable.
Tests must have no dependencies on other tests.

Rule 8. Do NOT test Kakao social login.
E2E tests cover email/password login only.

---

### Navigation

Rule 9. Use relative paths based on `baseURL`. Do NOT use absolute URLs.

```ts
// DO NOT
await page.goto('https://ddeudu.com/login');

// DO
await page.goto('/login');
```

---

## Key Flows

- `login.spec.ts` — teacher account login, student account login
- (more to be added)
