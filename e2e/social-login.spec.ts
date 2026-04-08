import { expect, test } from '@playwright/test';

test.describe('소셜 로그인 - 카카오 @optional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('카카오 로그인 버튼이 렌더링되고 유효한 OAuth URL을 가진다', async ({
    page,
  }) => {
    const kakaoButton = page.getByTestId('login-kakao-button');
    await expect(kakaoButton).toBeVisible();
    await expect(kakaoButton).toHaveAttribute(
      'href',
      /https:\/\/kauth\.kakao\.com\/oauth\/authorize/
    );
    await expect(kakaoButton).toHaveAttribute('href', /client_id=/);
    await expect(kakaoButton).toHaveAttribute('href', /redirect_uri=/);
    await expect(kakaoButton).toHaveAttribute(
      'href',
      /\/auth\/kakao\/callback/
    );
    await expect(kakaoButton).toHaveAttribute('href', /response_type=code/);
  });

  test('초대 토큰이 있으면 state 파라미터가 OAuth URL에 포함된다', async ({
    page,
  }) => {
    await page.goto('/login?token=test-invite-token');

    const kakaoButton = page.getByTestId('login-kakao-button');
    await expect(kakaoButton).toBeVisible();
    await expect(kakaoButton).toHaveAttribute(
      'href',
      /state=inviteToken%3Atest-invite-token/
    );
  });

  test('소셜 로그인 실패 파라미터가 오면 에러 메시지가 표시된다', async ({
    page,
  }) => {
    await page.goto('/login?error=kakao_failed');

    await expect(page.getByTestId('login-kakao-error-message')).toBeVisible();
  });
});
