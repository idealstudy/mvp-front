import { type Page, expect, test } from '@playwright/test';

const setupSignupSuccessMocks = async (page: Page) => {
  await page.route(
    '**/public/email-verifications/check-duplicate',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    }
  );

  await page.route(
    '**/public/email-verifications/verify-code',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    }
  );

  await page.route(
    '**/public/phone-number/check-duplicate**',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    }
  );

  await page.route('**/auth/sign-up', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });
};

// teacher account
test.describe('회원가입', () => {
  test('이메일 회원가입을 완료하면 로그인 페이지로 이동한다', async ({
    page,
  }) => {
    await setupSignupSuccessMocks(page);
    await page.goto('/register');

    await page.getByTestId('signup-email-input').fill('signup-e2e@test.test');
    await page.getByTestId('signup-email-next-button').click();

    await page.getByTestId('signup-send-verification-button').click();
    await page.getByTestId('signup-verification-code-input').fill('123456');
    await page.getByTestId('signup-verify-code-button').click();

    await page.getByTestId('signup-password-input').fill('Theedu1!');
    await page.getByTestId('signup-confirm-password-input').fill('Theedu1!');

    await page.getByTestId('signup-terms-required-terms-checkbox').click();
    await page.getByTestId('signup-terms-required-privacy-checkbox').click();
    await page.getByTestId('signup-terms-required-age-checkbox').click();
    await page.getByTestId('signup-credential-next-button').click();

    await page.getByTestId('signup-name-input').fill('E2E 테스트');
    await page.getByTestId('signup-phone-number-input').fill('01012345678');
    await page.getByTestId('signup-check-phone-duplicate-button').click();
    await page.getByTestId('signup-submit-button').click();

    await expect(page).toHaveURL(/\/login(?:\?|$)/, { timeout: 15000 });
  });

  test('중복 이메일이면 다음 단계로 진행하지 않고 에러를 표시한다', async ({
    page,
  }) => {
    await page.route(
      '**/public/email-verifications/check-duplicate',
      async (route) => {
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            message: '이미 사용중인 이메일입니다.',
          }),
        });
      }
    );

    await page.goto('/register');
    await page.getByTestId('signup-email-input').fill('duplicate@test.test');
    await page.getByTestId('signup-email-next-button').click();

    await expect(page.getByTestId('signup-email-error-message')).toBeVisible();
    await expect(page).toHaveURL('/register');
  });
});
