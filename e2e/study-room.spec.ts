import { PRIVATE } from '@/shared/constants';
import { expect, test } from '@playwright/test';

import { loginAsTeacher } from './helpers/auth';

// teacher account
// NOTE: test.describe.serial을 사용해 생성 → 수정 → 삭제 순서로 실행합니다.
// 생성한 스터디룸 ID를 이후 테스트에서 공유하며, 테스트 후 자동 정리됩니다.
test.describe.serial('스터디룸 CRUD', () => {
  test.setTimeout(60_000);

  let studyRoomId: number;

  test.beforeEach(async ({ page }) => {
    await loginAsTeacher(page);
  });

  /* ─────────────────────────────────────────────────────
   * 스터디룸 생성
   * ────────────────────────────────────────────────────*/
  test('기본 정보와 교육 프로필을 입력하여 스터디룸을 생성할 수 있다', async ({
    page,
  }) => {
    await page.goto(PRIVATE.ROOM.CREATE);

    // Step 1: 기본 정보
    await page.getByTestId('study-room-name-input').fill('E2E 테스트 스터디룸');
    await page
      .getByTestId('study-room-description-textarea')
      .fill('E2E 테스트용 스터디룸입니다.');
    await page.getByTestId('study-room-next-button').click();

    // Step 2: 교육 프로필
    await page.getByTestId('study-room-modality-ONLINE').click();
    await page.getByTestId('study-room-classForm-ONE_ON_ONE').click();
    await page.getByTestId('study-room-subjectType-MATH').click();

    await page.getByTestId('study-room-school-level-trigger').click();
    await page.getByTestId('study-room-school-level-OTHER').click();

    await page.getByTestId('study-room-submit-button').click();

    await page.waitForURL(/\/study-rooms\/\d+\/note/);
    await expect(page).toHaveURL(/\/study-rooms\/\d+\/note/);

    const match = page.url().match(/\/study-rooms\/(\d+)\/note/);
    studyRoomId = Number(match![1]);
  });

  /* ─────────────────────────────────────────────────────
   * 스터디룸 수정
   * ────────────────────────────────────────────────────*/
  test('스터디룸 이름을 수정할 수 있다', async ({ page }) => {
    await page.goto(PRIVATE.ROOM.EDIT(studyRoomId));

    await expect(page.getByTestId('study-room-name-input')).not.toHaveValue(
      '',
      {
        timeout: 10_000,
      }
    );

    const nameInput = page.getByTestId('study-room-name-input');
    await nameInput.clear();
    await nameInput.fill('수정된 E2E 스터디룸');
    await page.getByTestId('study-room-next-button').click();

    await page.getByTestId('study-room-edit-button').click();

    await expect(
      page.getByTestId('study-room-edit-confirm-button')
    ).toBeVisible();
    await page.getByTestId('study-room-edit-confirm-button').click();

    await page.waitForURL(PRIVATE.ROOM.DETAIL(studyRoomId));
    await expect(page).toHaveURL(PRIVATE.ROOM.DETAIL(studyRoomId));
  });

  /* ─────────────────────────────────────────────────────
   * 스터디룸 삭제
   * ────────────────────────────────────────────────────*/
  test('스터디룸을 삭제하면 대시보드로 이동한다', async ({ page }) => {
    await page.goto(PRIVATE.ROOM.DETAIL(studyRoomId));

    await page.getByTestId('study-room-kebab-button').click();
    await page.getByTestId('study-room-delete-menu-item').click();

    await expect(
      page.getByTestId('studyroom-delete-confirm-button')
    ).toBeVisible();
    await page.getByTestId('studyroom-delete-confirm-button').click();

    await expect(
      page.getByTestId('studyroom-delete-success-button')
    ).toBeVisible();
    await page.getByTestId('studyroom-delete-success-button').click();

    await page.waitForURL(PRIVATE.DASHBOARD.INDEX);
    await expect(page).toHaveURL(PRIVATE.DASHBOARD.INDEX);
  });
});
