import { PRIVATE } from '@/shared/constants';
import { expect, test } from '@playwright/test';

import { loginAsTeacher } from './helpers/auth';

// teacher account
// NOTE: test.describe.serial을 사용해 생성 → 수정 → 삭제 순서로 실행합니다.
// 생성한 스터디노트 ID를 이후 테스트에서 공유하며, 테스트 후 자동 정리됩니다.
test.describe.serial('스터디노트 CRUD', () => {
  test.setTimeout(60_000);

  const studyRoomId = Number(process.env.E2E_TEST_STUDY_ROOM_ID);

  let noteTitle: string;
  let noteId: number;

  test.beforeEach(async ({ page }) => {
    await loginAsTeacher(page);
  });

  /* ─────────────────────────────────────────────────────
   * 스터디노트 생성
   * ────────────────────────────────────────────────────*/
  test('제목, 내용, 공개범위를 입력하여 스터디노트를 생성할 수 있다', async ({
    page,
  }) => {
    await page.goto(PRIVATE.NOTE.CREATE(studyRoomId));

    noteTitle = `E2E 테스트 수업노트-${Date.now()}`;
    await page.getByTestId('note-title-input').fill(noteTitle);

    await page.getByTestId('note-visibility-trigger').click();
    await page.getByTestId('note-visibility-TEACHER_ONLY').click();

    const contentEditor = page.locator('.ProseMirror').first();
    await contentEditor.click();
    await page.keyboard.type('E2E 테스트 수업 내용입니다.');

    await expect(page.getByTestId('note-submit-button')).toBeEnabled();
    await page.getByTestId('note-submit-button').click();

    await page.waitForURL(PRIVATE.NOTE.LIST(studyRoomId));

    const newNoteLink = page
      .getByTestId('note-list-item')
      .filter({ hasText: noteTitle })
      .first();

    await expect(newNoteLink).toBeVisible({ timeout: 10_000 });

    const href = await newNoteLink.getAttribute('href');
    const match = href?.match(/\/note\/(\d+)$/);
    noteId = Number(match![1]);
  });

  /* ─────────────────────────────────────────────────────
   * 스터디노트 제목 수정
   * ────────────────────────────────────────────────────*/
  test('스터디노트 제목을 수정할 수 있다', async ({ page }) => {
    await page.goto(PRIVATE.NOTE.DETAIL(studyRoomId, noteId));

    await page.getByTestId('note-menu-button').click();
    await page.getByTestId('note-edit-menu-item').click();

    await page.waitForURL(PRIVATE.NOTE.EDIT(studyRoomId, noteId));

    await expect(page.getByTestId('note-title-input')).not.toHaveValue('', {
      timeout: 10_000,
    });

    const titleInput = page.getByTestId('note-title-input');
    await titleInput.clear();
    await titleInput.fill('수정된 E2E 수업노트');

    await expect(page.getByTestId('note-submit-button')).toBeEnabled();
    await page.getByTestId('note-submit-button').click();

    await page.waitForURL(PRIVATE.NOTE.DETAIL(studyRoomId, noteId));
    await expect(page).toHaveURL(PRIVATE.NOTE.DETAIL(studyRoomId, noteId));
  });

  /* ─────────────────────────────────────────────────────
   * 스터디노트 삭제
   * ────────────────────────────────────────────────────*/
  test('스터디노트를 삭제하면 목록으로 이동한다', async ({ page }) => {
    await page.goto(PRIVATE.NOTE.DETAIL(studyRoomId, noteId));

    await page.getByTestId('note-menu-button').click();
    await page.getByTestId('note-delete-menu-item').click();

    await expect(
      page.getByTestId('studyroom-delete-confirm-button')
    ).toBeVisible();
    await page.getByTestId('studyroom-delete-confirm-button').click();

    await expect(
      page.getByTestId('studyroom-delete-success-button')
    ).toBeVisible();
    await page.getByTestId('studyroom-delete-success-button').click();

    await page.waitForURL(PRIVATE.NOTE.LIST(studyRoomId));
    await expect(page).toHaveURL(PRIVATE.NOTE.LIST(studyRoomId));
  });
});
