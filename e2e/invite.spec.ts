import { type Page, expect, test } from '@playwright/test';

import { mockMemberInfo, setAuthCookie } from './helpers/auth-mock';

const MOCK_STUDENT = {
  id: 1,
  email: 'student@test.com',
  role: 'ROLE_STUDENT',
  name: '테스트 학생',
};
const MOCK_TEACHER = {
  id: 2,
  email: 'teacher@test.com',
  role: 'ROLE_TEACHER',
  name: '테스트 선생님',
};

const TEST_TOKEN = 'test-invite-token';

const mockInviteInfo = async (page: Page) => {
  await page.route('**/public/study-rooms/invitation*', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          studyRoomName: '테스트 스터디룸',
          teacherName: '테스트 선생님',
          message: '안녕하세요\n초대합니다',
        },
      }),
    });
  });
};

const mockAcceptInvitation = async (
  page: Page,
  response:
    | { type: 'success' }
    | {
        type: 'error';
        code:
          | 'INVITATION_EXPIRED'
          | 'DUPLICATED_INVITEE'
          | 'STUDY_ROOM_CAPACITY_EXCEEDED';
      }
) => {
  await page.route(
    '**/api/v1/student/study-room-invites/*/respond',
    (route) => {
      if (response.type === 'success') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              state: 'APPROVED',
              studyRoomResponse: {
                id: 123,
                name: '테스트 스터디룸',
                description: '테스트 설명',
                teacherName: '테스트 선생님',
                visibility: 'PUBLIC',
              },
            },
          }),
        });
      } else {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ code: response.code }),
        });
      }
    }
  );
};

// mobile·tablet에 동일한 testId 버튼이 중복 렌더링되므로 .first() 사용
const clickAcceptButton = async (page: Page) => {
  await page.goto(`/invite?token=${TEST_TOKEN}`);
  await page.getByTestId('invite-accept-button').first().click();
};

const clickRejectButton = async (page: Page) => {
  await page.goto(`/invite?token=${TEST_TOKEN}`);
  await page.getByTestId('invite-reject-button').first().click();
};

const expectInviteErrorPage = async (
  page: Page,
  reason: string,
  title: string
) => {
  await page.waitForURL(`/invite/error?reason=${reason}`);
  await expect(page.getByTestId('invite-error-content')).toBeVisible();
  await expect(page.getByTestId('invite-error-title')).toHaveText(title);
};

/* ─────────────────────────────────────────────────────
 * 1. 초대장 페이지 진입
 * ────────────────────────────────────────────────────*/
test.describe('초대장 페이지 진입', () => {
  test('유효한 토큰으로 접속하면 초대장이 표시된다', async ({ page }) => {
    await mockInviteInfo(page);

    await page.goto(`/invite?token=${TEST_TOKEN}`);

    await expect(page.getByTestId('invite-teacher-name')).toHaveText(
      'From. 테스트 선생님선생님'
    );
    await expect(page.getByTestId('invite-study-room-name')).toHaveText(
      '테스트 스터디룸 초대장'
    );
    await expect(page.getByTestId('invite-message')).toBeVisible();
  });

  test('만료된 토큰으로 접속하면 EXPIRED_LINK 에러 페이지가 표시된다', async ({
    page,
  }) => {
    await page.route('**/public/study-rooms/invitation*', (route) => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ code: 'INVITATION_EXPIRED' }),
      });
    });

    await page.goto(`/invite?token=${TEST_TOKEN}`);

    await expectInviteErrorPage(
      page,
      'EXPIRED_LINK',
      '이 초대 링크는 만료되었습니다.'
    );
  });

  test('유효하지 않은 토큰으로 접속하면 INVALID_LINK 에러 페이지가 표시된다', async ({
    page,
  }) => {
    await page.route('**/public/study-rooms/invitation*', (route) => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ code: 'INVALID_TOKEN' }),
      });
    });

    await page.goto(`/invite?token=${TEST_TOKEN}`);

    await expectInviteErrorPage(
      page,
      'INVALID_LINK',
      '유효하지 않은 링크입니다.'
    );
  });
});

/* ─────────────────────────────────────────────────────
 * 2. 비로그인 상태에서 참여하기
 * ────────────────────────────────────────────────────*/
test.describe('비로그인 상태에서 참여하기', () => {
  test('참여하기를 누르면 로그인 모달이 열린다', async ({ page }) => {
    await mockInviteInfo(page);

    await clickAcceptButton(page);

    await expect(page.getByTestId('invite-login-modal')).toBeVisible();
  });

  test('참여하기 → 로그인 모달 → 로그인 페이지 → 회원가입 페이지까지 token이 유지된다', async ({
    page,
  }) => {
    await mockInviteInfo(page);

    await clickAcceptButton(page);
    await page.getByTestId('invite-login-modal-submit-button').click();

    await expect(page).toHaveURL(
      `/login?token=${encodeURIComponent(TEST_TOKEN)}`
    );

    await page.getByRole('link', { name: '회원가입' }).click();

    await expect(page).toHaveURL(
      `/register?token=${encodeURIComponent(TEST_TOKEN)}`
    );
  });

  // 실제 로그인 플로우(쿠키 발급 → 리다이렉트 → 초대 처리)를 검증하므로 실 credentials 사용
  test('로그인 후 token이 유지되어 초대가 처리된다', async ({ page }) => {
    await mockInviteInfo(page);
    await mockAcceptInvitation(page, { type: 'success' });

    await page.goto(`/login?token=${encodeURIComponent(TEST_TOKEN)}`);
    await page
      .getByTestId('login-email-input')
      .fill(process.env.E2E_STUDENT_EMAIL!);
    await page
      .getByTestId('login-password-input')
      .fill(process.env.E2E_STUDENT_PASSWORD!);
    await page.getByTestId('login-submit-button').click();

    await page.waitForURL(`/dashboard?token=${encodeURIComponent(TEST_TOKEN)}`);
    await page.waitForURL('/invite/success?studyRoomId=123');
    await expect(page.getByTestId('invite-success-content')).toBeVisible();
  });
});

/* ─────────────────────────────────────────────────────
 * 3. 학생 계정으로 참여하기
 * ────────────────────────────────────────────────────*/
test.describe('학생 계정으로 참여하기', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthCookie(page);
    await mockMemberInfo(page, MOCK_STUDENT);
    await mockInviteInfo(page);
    await mockAcceptInvitation(page, { type: 'success' });
  });

  test('참여하기를 누르면 참여 성공 화면이 표시된다', async ({ page }) => {
    await clickAcceptButton(page);

    await page.waitForURL('/invite/success?studyRoomId=123');
    await expect(page.getByTestId('invite-success-content')).toBeVisible();
  });

  test('성공 화면에서 스터디룸 바로 가기를 누르면 해당 스터디룸으로 이동한다', async ({
    page,
  }) => {
    await clickAcceptButton(page);

    await page.waitForURL('/invite/success?studyRoomId=123');
    await page.getByTestId('invite-success-go-to-room-button').click();

    await expect(page).toHaveURL('/study-rooms/123/note');
  });
});

/* ─────────────────────────────────────────────────────
 * 4. 선생님 계정으로 참여 시도
 * ────────────────────────────────────────────────────*/
test.describe('선생님 계정으로 참여 시도', () => {
  test('참여하기를 누르면 ROLE_NOT_MATCH 에러 페이지가 표시된다', async ({
    page,
  }) => {
    await setAuthCookie(page);
    await mockMemberInfo(page, MOCK_TEACHER);
    await mockInviteInfo(page);

    await clickAcceptButton(page);

    await expectInviteErrorPage(
      page,
      'ROLE_NOT_MATCH',
      '학생 계정으로만 참여할 수 있어요'
    );
  });
});

/* ─────────────────────────────────────────────────────
 * 5. 초대 거절하기
 * ────────────────────────────────────────────────────*/
test.describe('초대 거절하기', () => {
  test.beforeEach(async ({ page }) => {
    await mockInviteInfo(page);
  });

  test('거절하기를 누르면 거절 확인 모달이 열린다', async ({ page }) => {
    await clickRejectButton(page);

    await expect(page.getByTestId('invite-exit-modal')).toBeVisible();
  });

  test('모달에서 취소를 누르면 모달이 닫히고 초대장으로 돌아온다', async ({
    page,
  }) => {
    await clickRejectButton(page);
    await page.getByTestId('invite-exit-modal-cancel-button').click();

    await expect(page.getByTestId('invite-exit-modal')).not.toBeVisible();
    await expect(
      page.getByTestId('invite-accept-button').first()
    ).toBeVisible();
  });

  test('비로그인 상태에서 모달 확인을 누르면 홈으로 이동한다', async ({
    page,
  }) => {
    await clickRejectButton(page);
    await page.getByTestId('invite-exit-modal-confirm-button').click();

    await expect(page).toHaveURL('/');
  });

  test('로그인 상태에서 모달 확인을 누르면 대시보드로 이동한다', async ({
    page,
  }) => {
    await setAuthCookie(page);
    await mockMemberInfo(page, MOCK_STUDENT);

    await clickRejectButton(page);
    await page.getByTestId('invite-exit-modal-confirm-button').click();

    await expect(page).toHaveURL('/dashboard');
  });
});

/* ─────────────────────────────────────────────────────
 * 6. 참여하기 에러 케이스
 * ────────────────────────────────────────────────────*/
test.describe('참여하기 에러 케이스', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthCookie(page);
    await mockMemberInfo(page, MOCK_STUDENT);
    await mockInviteInfo(page);
  });

  test('이미 참여 중인 스터디룸이면 ALREADY_PARTICIPATED 에러 페이지가 표시된다', async ({
    page,
  }) => {
    await mockAcceptInvitation(page, {
      type: 'error',
      code: 'DUPLICATED_INVITEE',
    });

    await clickAcceptButton(page);

    await expectInviteErrorPage(
      page,
      'ALREADY_PARTICIPATED',
      '이미 참여 중인 스터디룸이에요'
    );
  });

  test('정원이 꽉 찬 스터디룸이면 STUDY_ROOM_CAPACITY_EXCEEDED 에러 페이지가 표시된다', async ({
    page,
  }) => {
    await mockAcceptInvitation(page, {
      type: 'error',
      code: 'STUDY_ROOM_CAPACITY_EXCEEDED',
    });

    await clickAcceptButton(page);

    await expectInviteErrorPage(
      page,
      'STUDY_ROOM_CAPACITY_EXCEEDED',
      '가득 찬 스터디룸이에요'
    );
  });
});
