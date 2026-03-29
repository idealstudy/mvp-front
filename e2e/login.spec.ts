import { expect, test } from '@playwright/test';

// teacher account
test.describe('로그인 - 선생님', () => {
  test('이메일/비밀번호로 로그인할 수 있다', async ({ page }) => {
    await page.goto('/login');

    await page
      .getByTestId('login-email-input')
      .fill(process.env.E2E_TEACHER_EMAIL!);
    await page
      .getByTestId('login-password-input')
      .fill(process.env.E2E_TEACHER_PASSWORD!);
    await page.getByTestId('login-submit-button').click();

    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });

  test('잘못된 비밀번호 입력 시 에러 메시지가 표시된다', async ({ page }) => {
    await page.goto('/login');

    await page
      .getByTestId('login-email-input')
      .fill(process.env.E2E_TEACHER_EMAIL!);
    await page.getByTestId('login-password-input').fill('wrong-password');
    await page.getByTestId('login-submit-button').click();

    await expect(
      page.getByText('아이디 또는 비밀번호가 일치하지 않습니다.')
    ).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});

// student account
test.describe('로그인 - 학생', () => {
  test('이메일/비밀번호로 로그인할 수 있다', async ({ page }) => {
    await page.goto('/login');

    await page
      .getByTestId('login-email-input')
      .fill(process.env.E2E_STUDENT_EMAIL!);
    await page
      .getByTestId('login-password-input')
      .fill(process.env.E2E_STUDENT_PASSWORD!);
    await page.getByTestId('login-submit-button').click();

    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });
});
