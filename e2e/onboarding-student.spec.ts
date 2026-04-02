import { PRIVATE } from '@/shared/constants';
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

// ─── Mock 데이터 ──────────────────────────────────────────────────────────────

const STUDENT_MEMBER = {
  id: 2,
  email: 'student@test.com',
  name: '테스트학생',
  role: 'ROLE_STUDENT',
};

// ─── Mock 헬퍼 함수 ──────────────────────────────────────────────────────────

/** 모든 /api/v1/** 요청에 대한 기본 fallback mock (특정 mock 등록 후 사용) */
async function setupCatchAll(page: Page) {
  await page.route('**/api/v1/**', async (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 200, message: 'ok', data: {} }),
    })
  );
}

async function mockMemberInfo(page: Page) {
  await page.route('**/api/v1/member/info', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 200,
        message: 'ok',
        data: STUDENT_MEMBER,
      }),
    });
  });
}

async function setStudent(page: Page) {
  await page.context().addCookies([
    {
      name: 'Authorization',
      value: 'test-token',
      domain: 'localhost',
      path: '/',
    },
  ]);

  await mockMemberInfo(page);
}

async function mockStudentStudyRooms(page: Page, rooms: object[]) {
  await page.route('**/api/v1/student/study-rooms', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 200, message: 'ok', data: rooms }),
      });
    } else {
      await route.continue();
    }
  });
}

async function mockStudentNotes(page: Page, notes: object[]) {
  await page.route(
    '**/api/v1/student/dashboard/teaching-notes**',
    async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 200,
            message: 'ok',
            data: {
              content: notes,
              totalElements: notes.length,
              pageNumber: 0,
              size: notes.length,
              totalPages: 1,
            },
          }),
        });
      } else {
        await route.continue();
      }
    }
  );
}

async function mockStudentQnA(page: Page, qnas: object[]) {
  await page.route('**/api/v1/student/dashboard/qna**', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 200,
          message: 'ok',
          data: {
            content: qnas,
            totalElements: qnas.length,
            pageNumber: 0,
            size: qnas.length,
            totalPages: 1,
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
}

async function mockStudentHomework(page: Page, homeworks: object[]) {
  await page.route('**/api/v1/student/dashboard/homeworks**', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 200,
          message: 'ok',
          data: {
            content: homeworks,
            pageNumber: 0,
            size: homeworks.length,
            totalElements: homeworks.length,
            totalPages: 1,
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
}

// ─── 학생 온보딩 테스트 ──────────────────────────────────────────────────────────────

test.describe('학생 온보딩', () => {
  test.beforeEach(async ({ page }) => {
    await setupCatchAll(page);
    await setStudent(page);
  });

  test('초기 상태: 스터디룸이 없을 때 초대 안내 타이틀이 보이고 닫기 버튼이 없다', async ({
    page,
  }) => {
    await mockStudentStudyRooms(page, []); // 스터디룸 없음 (hasRooms = false)
    await mockStudentNotes(page, []); // 수업노트 없음 (hasNotes = false)
    await mockStudentQnA(page, []); // QnA 없음 (hasQuestions = false)
    await mockStudentHomework(page, []); // 과제 없음 (hasAssignments = false)

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // 학생 온보딩 확인
    await page.waitForSelector('[data-testid="student-onboarding"]');

    await expect(page.getByText('선생님으로부터 초대를 받아')).toBeVisible();

    // 닫기 버튼(text 및 aria-label 포함)은 표시되지 않아야 한다
    await expect(page.getByRole('button', { name: '닫기' })).not.toBeVisible();
  });

  test('스터디룸 참여 후: 타이틀이 변경되고 닫기 버튼이 표시된다', async ({
    page,
  }) => {
    const STUDENT_ROOM = { id: 1, name: '참여한 스터디룸' };

    await setStudent(page);
    await mockStudentStudyRooms(page, [STUDENT_ROOM]);
    await mockStudentNotes(page, []); // 수업노트 없음 (hasNotes = false)
    await mockStudentQnA(page, []); // QnA 없음 (hasQuestions = false)
    await mockStudentHomework(page, []); // 과제 없음 (hasAssignments = false)

    await page.goto(PRIVATE.DASHBOARD.INDEX);
    await page.waitForLoadState('networkidle');

    // 학생 온보딩 확인
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

    // 닫기 버튼이 표시되어야 한다
    await expect(page.getByRole('button', { name: '닫기' })).toBeVisible();
  });

  test('노트가 있을 때: 노트 step 표시', async ({ page }) => {
    const STUDENT_ROOM = { id: 1, name: '참여한 스터디룸' };

    await setStudent(page);
    await mockStudentStudyRooms(page, [STUDENT_ROOM]);
    await mockStudentNotes(page, [
      {
        id: 1,
        title: '수업노트 1',
        studyRoomId: 1,
        studyRoomName: '참여한 스터디룸',
        contentPreview: '수업노트 1',
      },
    ]); // 수업노트 있음 (hasNotes = true)
    await mockStudentQnA(page, []); // QnA 없음 (hasQuestions = false)
    await mockStudentHomework(page, []); // 과제 없음 (hasAssignments = false)

    await page.goto(PRIVATE.DASHBOARD.INDEX);
    await page.waitForLoadState('networkidle');

    // 학생 온보딩 확인
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

    // 닫기 버튼이 표시되어야 한다
    await expect(page.getByRole('button', { name: '닫기' })).toBeVisible();
  });

  test('모든 단계 완료 시: 온보딩 컴포넌트가 표시되지 않는다', async ({
    page,
  }) => {
    const STUDENT_ROOM = { id: 1, name: '참여한 스터디룸' };

    await setupCatchAll(page);
    await setStudent(page);
    await mockStudentStudyRooms(page, [STUDENT_ROOM]);
    await mockStudentNotes(page, [
      {
        id: 1,
        title: '수업노트 1',
        studyRoomId: 1,
        studyRoomName: '참여한 스터디룸',
        contentPreview: '수업노트 1',
      },
    ]); // 수업노트 있음 (hasNotes = true)
    await mockStudentQnA(page, [
      {
        id: 1,
        studyRoomId: 1,
        studyRoomName: '참여한 스터디룸',
        title: '질문 1',
        contentPreview: '질문 내용',
        regDate: '2026-01-01',
      },
    ]); // QnA 있음 (hasQuestions = true)
    await mockStudentHomework(page, [
      {
        id: 1,
        title: '과제 1',
        studyRoomId: 1,
        studyRoomName: '참여한 스터디룸',
        regDate: '2026-01-01',
        deadlineLabel: 'UPCOMING',
        submittedRatePercent: 100,
        dday: 365,
      },
    ]); // 과제 있음 (hasAssignments = true)

    await page.goto(PRIVATE.DASHBOARD.INDEX);
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByTestId('[data-testid="student-onboarding"]')
    ).not.toBeVisible();
  });
});
