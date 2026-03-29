# E2E Testing (Playwright)

## Setup

- Base URL: `http://localhost:3000`
- Browsers: chromium, webkit
- Test directory: `e2e/`
- Config file: `playwright.config.ts`

## CI

```yaml
- name: Install dependencies
  run: npm ci
- name: Install Playwright Browsers
  run: npx playwright install --with-deps
- name: Run Playwright tests
  run: npx playwright test
```

## Environment Variables

Test accounts are dev environment shared accounts. Managed in `.env.local`. Never hardcode credentials.

- `E2E_TEACHER_EMAIL` / `E2E_TEACHER_PASSWORD`
- `E2E_STUDENT_EMAIL` / `E2E_STUDENT_PASSWORD`

## Authentication

Each test handles login independently. No session reuse between tests.

## Debugging

On failure, trace is collected automatically (`trace: 'on-first-retry'`). Check `playwright-report/` for the trace viewer.

## Rules

### File and Test Structure

- File name: `{feature}.spec.ts` (e.g. `login.spec.ts`)
- Group related tests with `describe`, individual scenarios with `test`
- Add a comment at the top of each test indicating the role being used

```ts
// teacher account
describe('login', () => {
  test('can log in with email and password', async ({ page }) => {
    ...
  });
});
```

### Selectors

Use `data-testid` attributes first. Avoid text or CSS selectors — they break easily when UI changes.

Naming convention: `{feature}-{element}`

```ts
// do-not
page.locator('.login-btn');
page.getByText('로그인');

// do
page.getByTestId('login-submit-button');
```

Examples: `login-email-input`, `login-password-input`, `login-submit-button`, `course-card`

**When writing a test that uses `data-testid`, add the corresponding attribute to the source component as well.** Do not write tests that reference `data-testid` values that don't exist in the codebase.

### Waiting

Do not use `waitForTimeout`. Use condition-based waiting only.

```ts
// do-not
await page.waitForTimeout(2000);

// do
await page.waitForURL('/dashboard');
await expect(locator).toBeVisible();
```

### Independence

Each test must be independently executable. No dependencies between tests.

### Navigation

Use relative paths based on `baseURL`.

```ts
// do-not
await page.goto('https://example.com/login');

// do
await page.goto('/login');
```

### Scope

Kakao social login is excluded from E2E testing. Test only email/password login.

## Key Flows

- login (teacher, student)
- (to be added)
