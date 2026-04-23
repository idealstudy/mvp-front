import { Page, expect, test } from '@playwright/test';

import { loginAsStudent, loginAsTeacher } from './helpers/auth';

const homeworkContent = 'E2E 과제 내용';

async function goToTeacherHomeworkCreatePage(page: Page) {
  // 개발 서버에서 로딩이 오래 걸리는 이슈로 인해 타임아웃 시간 증가
  test.setTimeout(60000);

  await loginAsTeacher(page);
  await page.goto(
    `/study-rooms/${process.env.E2E_TEST_STUDY_ROOM_ID}/homework`
  );
  await page.getByTestId('homework-create-button').click();
  await page.waitForURL(
    `/study-rooms/${process.env.E2E_TEST_STUDY_ROOM_ID}/homework/new`
  );

  await expect(page).toHaveURL(
    `/study-rooms/${process.env.E2E_TEST_STUDY_ROOM_ID}/homework/new`
  );
}

async function createHomeworkAsTeacher(page: Page) {
  const homeworkTitle = `E2E 과제 제목-${Date.now()}`;

  await goToTeacherHomeworkCreatePage(page);

  const submitButton = page.getByTestId('homework-submit-button');
  const contentEditor = page.locator('.ProseMirror').first();

  await page.getByTestId('homework-title-input').fill(homeworkTitle);
  await page.getByTestId('homework-student-tag-input').click();
  await page
    .getByTestId('homework-student-tag-input-search')
    .fill(process.env.E2E_TEST_STUDENT_NAME!);
  await page
    .getByTestId('homework-student-tag-input-option')
    .filter({ hasText: process.env.E2E_TEST_STUDENT_NAME! })
    .click();

  await page.getByTestId('homework-deadline-input').fill('2026-12-31T23:59');
  await contentEditor.click();
  await page.keyboard.type(homeworkContent);

  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  await page.waitForURL(
    `/study-rooms/${process.env.E2E_TEST_STUDY_ROOM_ID}/homework`
  );

  const newHomeworkLink = page
    .getByTestId('homework-list-item')
    .filter({ hasText: homeworkTitle })
    .first();

  await expect(newHomeworkLink).toBeVisible({ timeout: 10000 });

  const newHomeworkHref = await newHomeworkLink.getAttribute('href');
  expect(newHomeworkHref).not.toBeNull();

  const homeworkId = newHomeworkHref?.match(/\/homework\/(\d+)$/)?.[1] ?? null;
  expect(homeworkId).not.toBeNull();

  return { homeworkId: homeworkId!, homeworkTitle };
}

// teacher account
test.describe('과제 - 선생님', () => {
  test('과제 만들기 버튼을 통해 생성 페이지로 이동할 수 있다', async ({
    page,
  }) => {
    await goToTeacherHomeworkCreatePage(page);
  });

  test('필수 입력값이 하나라도 없으면 저장 버튼이 비활성화된다.', async ({
    page,
  }) => {
    const homeworkTitle = `E2E 과제 제목-${Date.now()}`;

    await goToTeacherHomeworkCreatePage(page);

    const submitButton = page.getByTestId('homework-submit-button');
    const contentEditor = page.locator('.ProseMirror').first();

    await expect(submitButton).toBeDisabled();

    await page.getByTestId('homework-title-input').fill(homeworkTitle);
    await expect(submitButton).toBeDisabled();

    await page.getByTestId('homework-deadline-input').fill('2026-12-31T23:59');
    await expect(submitButton).toBeDisabled();

    await contentEditor.click();
    await page.keyboard.type(homeworkContent);

    await expect(submitButton).toBeEnabled();
  });

  test('과제 정보를 모두 입력한 후 과제를 생성하고 확인할 수 있다', async ({
    page,
  }) => {
    const { homeworkId, homeworkTitle } = await createHomeworkAsTeacher(page);

    await page.goto(
      `/study-rooms/${process.env.E2E_TEST_STUDY_ROOM_ID}/homework/${homeworkId}`
    );

    await expect(page).toHaveURL(
      new RegExp(
        `/study-rooms/${process.env.E2E_TEST_STUDY_ROOM_ID}/homework/\\d+$`
      )
    );

    const homeworkTitleHeading = page
      .getByRole('heading')
      .filter({ hasText: homeworkTitle });

    await expect(homeworkTitleHeading).toBeVisible({ timeout: 10000 });
  });
});

// student account
test.describe('과제 - 학생', () => {
  test.setTimeout(60000);

  test('과제 진입이 성공적으로 이루어지는지 확인합니다.', async ({ page }) => {
    await loginAsStudent(page);

    await page.goto(
      `/study-rooms/${process.env.E2E_TEST_STUDY_ROOM_ID}/homework`
    );
    await page.waitForURL(
      `/study-rooms/${process.env.E2E_TEST_STUDY_ROOM_ID}/homework`
    );
    await expect(page).toHaveURL(
      `/study-rooms/${process.env.E2E_TEST_STUDY_ROOM_ID}/homework`
    );

    const firstHomeworkLink = page.getByTestId('homework-list-item').first();

    await expect(firstHomeworkLink).toBeVisible({ timeout: 10000 });

    const firstHomeworkTitle = (
      await firstHomeworkLink.getByTestId('homework-list-title').textContent()
    )?.trim();
    expect(firstHomeworkTitle).not.toBeNull();

    const studentHomeworkHref = await firstHomeworkLink.getAttribute('href');
    expect(studentHomeworkHref).not.toBeNull();

    await page.goto(studentHomeworkHref!);
    await expect(page).toHaveURL(
      new RegExp(
        `/study-rooms/${process.env.E2E_TEST_STUDY_ROOM_ID}/homework/\\d+`
      )
    );
    await expect(
      page.getByRole('heading', { name: firstHomeworkTitle! })
    ).toBeVisible();
  });

  test('과제 미제출인 경우를 찾아 과제를 제출할 수 있다.', async ({ page }) => {
    await loginAsStudent(page);

    await page.goto(
      `/study-rooms/${process.env.E2E_TEST_STUDY_ROOM_ID}/homework`
    );
    await expect(page).toHaveURL(
      `/study-rooms/${process.env.E2E_TEST_STUDY_ROOM_ID}/homework`
    );

    const unsubmittedHomework = page
      .getByTestId('homework-list-item')
      .filter({ hasText: '미제출' })
      .first();

    await expect(unsubmittedHomework).toBeVisible({ timeout: 10000 });

    const homeworkHref = await unsubmittedHomework.getAttribute('href');
    expect(homeworkHref).not.toBeNull();

    await page.goto(homeworkHref!);
    await expect(page).toHaveURL(
      new RegExp(
        `/study-rooms/${process.env.E2E_TEST_STUDY_ROOM_ID}/homework/\\d+`
      )
    );

    const contentEditor = page.locator('.ProseMirror').last();
    await contentEditor.click();
    await page.keyboard.type('E2E 학생 제출 내용');

    const submitButton = page.getByTestId('homework-submit-button');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
  });
});
