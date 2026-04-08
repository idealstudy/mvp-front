import { type Page, expect, test } from '@playwright/test';

const requiredEnvKeys = [
  'E2E_TEACHER_EMAIL',
  'E2E_TEACHER_PASSWORD',
  'E2E_STUDENT_EMAIL',
  'E2E_STUDENT_PASSWORD',
] as const;

test.beforeAll(() => {
  const missingKeys = requiredEnvKeys.filter((key) => !process.env[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required e2e env vars: ${missingKeys.join(', ')}. Check your .env.local.`
    );
  }
});

const loginWithEmailPassword = async (
  page: Page,
  email: string,
  password: string,
  expectedStatus: number
) => {
  await page.goto('/login');
  await page.getByTestId('login-email-input').fill(email);
  await page.getByTestId('login-password-input').fill(password);

  const loginResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/api/v1/auth/login') &&
      response.request().method() === 'POST' &&
      response.status() === expectedStatus,
    { timeout: 15000 }
  );

  await page.getByTestId('login-submit-button').click();
  await loginResponsePromise;
};

// teacher account
test.describe('로그인 - 선생님', () => {
  test('이메일/비밀번호로 로그인할 수 있다', async ({ page }) => {
    await loginWithEmailPassword(
      page,
      process.env.E2E_TEACHER_EMAIL!,
      process.env.E2E_TEACHER_PASSWORD!,
      200
    );

    await expect(page).toHaveURL(/\/dashboard(?:\?|$)/, { timeout: 15000 });
    await expect(page.getByTestId('login-email-input')).toHaveCount(0);
  });

  test('잘못된 비밀번호 입력 시 에러 메시지가 표시된다', async ({ page }) => {
    await loginWithEmailPassword(
      page,
      process.env.E2E_TEACHER_EMAIL!,
      'wrong-password',
      401
    );

    await expect(
      page.getByTestId('login-password-error-message')
    ).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});

// student account
test.describe('로그인 - 학생', () => {
  test('이메일/비밀번호로 로그인할 수 있다', async ({ page }) => {
    await loginWithEmailPassword(
      page,
      process.env.E2E_STUDENT_EMAIL!,
      process.env.E2E_STUDENT_PASSWORD!,
      200
    );

    await expect(page).toHaveURL(/\/dashboard(?:\?|$)/, { timeout: 15000 });
    await expect(page.getByTestId('login-email-input')).toHaveCount(0);
  });
});
