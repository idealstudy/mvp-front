import type { Page } from '@playwright/test';

import { okBody } from './api-mock';

export async function setAuthCookie(page: Page) {
  await page.context().addCookies([
    {
      name: 'Authorization',
      value: 'test-token',
      domain: 'localhost',
      path: '/',
    },
  ]);
}

export async function mockMemberInfo(page: Page, member: object) {
  await page.route('**/api/v1/member/info', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: okBody(member),
    });
  });
}
