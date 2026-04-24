import { PRIVATE } from '@/shared/constants';
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { mockGet, okBody, pageBody, setupCatchAll } from './helpers/api-mock';
import { mockMemberInfo, setAuthCookie } from './helpers/auth-mock';

// ─── 상수 ────────────────────────────────────────────────────────────────────

const STUDENT_MEMBER = {
  id: 2,
  email: 'student@test.com',
  name: '테스트학생',
  role: 'ROLE_STUDENT',
};

const STUDENT_ROOM = { id: 1, name: '참여한 스터디룸' };

// ─── 픽스처 데이터 ───────────────────────────────────────────────────────────

const NOTE = {
  id: 1,
  title: '수업노트 1',
  studyRoomId: 1,
  studyRoomName: STUDENT_ROOM.name,
  contentPreview: '수업노트 내용',
};

const QNA = {
  id: 1,
  studyRoomId: 1,
  studyRoomName: STUDENT_ROOM.name,
  title: '질문 1',
  contentPreview: '질문 내용',
  regDate: '2026-01-01',
};

const HOMEWORK = {
  id: 1,
  title: '과제 1',
  studyRoomId: 1,
  studyRoomName: STUDENT_ROOM.name,
  regDate: '2026-01-01',
  deadlineLabel: 'UPCOMING',
  submittedRatePercent: 100,
  dday: 365,
};

// ─── Mock 헬퍼 ───────────────────────────────────────────────────────────────

async function setStudent(page: Page) {
  await setAuthCookie(page);
  await mockMemberInfo(page, STUDENT_MEMBER);
}

async function mockStudentStudyRooms(page: Page, rooms: object[]) {
  await mockGet(page, '**/api/v1/student/study-rooms', okBody(rooms));
}

async function mockStudentNotes(page: Page, notes: object[]) {
  await mockGet(
    page,
    '**/api/v1/student/dashboard/teaching-notes**',
    pageBody(notes)
  );
}

async function mockStudentQnA(page: Page, qnas: object[]) {
  await mockGet(page, '**/api/v1/student/dashboard/qna**', pageBody(qnas));
}

async function mockStudentHomework(page: Page, homeworks: object[]) {
  await mockGet(
    page,
    '**/api/v1/student/dashboard/homeworks**',
    pageBody(homeworks)
  );
}

async function mockAllEmpty(page: Page) {
  await mockStudentStudyRooms(page, []);
  await mockStudentNotes(page, []);
  await mockStudentQnA(page, []);
  await mockStudentHomework(page, []);
}

// ─── 학생 온보딩 테스트 ──────────────────────────────────────────────────────

test.describe('학생 온보딩', () => {
  test.beforeEach(async ({ page }) => {
    await setupCatchAll(page);
    await setStudent(page);
  });

  test('초기 상태: 스터디룸이 없을 때 초대 안내 타이틀이 보이고 닫기 버튼이 없다', async ({
    page,
  }) => {
    await mockAllEmpty(page);

    await page.goto(PRIVATE.DASHBOARD.INDEX);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="student-onboarding"]');

    await expect(page.getByText('선생님으로부터 초대를 받아')).toBeVisible();
    await expect(page.getByRole('button', { name: '닫기' })).not.toBeVisible();
  });

  test('스터디룸 참여 후: 타이틀이 변경되고 닫기 버튼이 표시된다', async ({
    page,
  }) => {
    await mockStudentStudyRooms(page, [STUDENT_ROOM]);
    await mockStudentNotes(page, []);
    await mockStudentQnA(page, []);
    await mockStudentHomework(page, []);

    await page.goto(PRIVATE.DASHBOARD.INDEX);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="student-onboarding"]');

    await expect(
      page.getByText('이제 디에듀의 다양한 기능을 이용해보세요!')
    ).toBeVisible();
    await expect(
      page.getByTestId('onboarding-선생님 초대 받기-completed')
    ).toBeVisible();
    await expect(
      page.getByTestId('onboarding-수업노트 확인하기-incompleted')
    ).toBeVisible();
    await expect(page.getByRole('button', { name: '닫기' })).toBeVisible();
  });

  test('노트가 있을 때: 노트 step 표시', async ({ page }) => {
    await mockStudentStudyRooms(page, [STUDENT_ROOM]);
    await mockStudentNotes(page, [NOTE]);
    await mockStudentQnA(page, []);
    await mockStudentHomework(page, []);

    await page.goto(PRIVATE.DASHBOARD.INDEX);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="student-onboarding"]');

    await expect(
      page.getByText('이제 디에듀의 다양한 기능을 이용해보세요!')
    ).toBeVisible();
    await expect(
      page.getByTestId('onboarding-선생님 초대 받기-completed')
    ).toBeVisible();
    await expect(
      page.getByTestId('onboarding-수업노트 확인하기-completed')
    ).toBeVisible();
    await expect(page.getByRole('button', { name: '닫기' })).toBeVisible();
  });

  test('모든 단계 완료 시: 온보딩 컴포넌트가 표시되지 않는다', async ({
    page,
  }) => {
    await mockStudentStudyRooms(page, [STUDENT_ROOM]);
    await mockStudentNotes(page, [NOTE]);
    await mockStudentQnA(page, [QNA]);
    await mockStudentHomework(page, [HOMEWORK]);

    await page.goto(PRIVATE.DASHBOARD.INDEX);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('student-onboarding')).not.toBeVisible();
  });
});
