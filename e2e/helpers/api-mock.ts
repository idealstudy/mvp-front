import type { Page } from '@playwright/test';

/** { status: 200, message: 'ok', data } 형태의 응답 body 문자열 반환 */
export function okBody(data: unknown) {
  return JSON.stringify({ status: 200, message: 'ok', data });
}

/** 페이지네이션 응답 body 문자열 반환 */
export function pageBody(content: object[]) {
  return okBody({
    content,
    pageNumber: 0,
    size: content.length,
    totalElements: content.length,
    totalPages: 1,
  });
}

/** GET 요청만 가로채서 응답하는 route mock */
export async function mockGet(page: Page, url: string, body: string) {
  await page.route(url, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body,
      });
    } else {
      await route.continue();
    }
  });
}

/** 모든 /api/v1/** 요청에 대한 기본 fallback mock */
export async function setupCatchAll(page: Page) {
  await page.route('**/api/v1/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: okBody({}),
    })
  );
}
