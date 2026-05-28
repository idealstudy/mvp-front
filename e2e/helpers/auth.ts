import { PRIVATE } from '@/shared/constants';
import { type Page, expect } from '@playwright/test';

// 로그인
export async function loginAsTeacher(page: Page) {
  await page.goto('/login');
  await page
    .getByTestId('login-email-input')
    .fill(process.env.E2E_TEACHER_EMAIL!);
  await page
    .getByTestId('login-password-input')
    .fill(process.env.E2E_TEACHER_PASSWORD!);
  await page.getByTestId('login-submit-button').click();

  await page.waitForURL(PRIVATE.DASHBOARD.TEACHER);
  await expect(page).toHaveURL(PRIVATE.DASHBOARD.TEACHER);
}

export async function loginAsStudent(page: Page) {
  await page.goto('/login');
  await page
    .getByTestId('login-email-input')
    .fill(process.env.E2E_STUDENT_EMAIL!);
  await page
    .getByTestId('login-password-input')
    .fill(process.env.E2E_STUDENT_PASSWORD!);
  await page.getByTestId('login-submit-button').click();

  await page.waitForURL(PRIVATE.DASHBOARD.STUDENT);
  await expect(page).toHaveURL(PRIVATE.DASHBOARD.STUDENT);
}
