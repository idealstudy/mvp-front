import {
  TeacherOnboardingDTO,
  TeacherOnboardingStepType,
  TeacherOnboardingStepTypes,
} from '@/entities/onboarding';
import { PRIVATE } from '@/shared/constants';
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { okBody, setupCatchAll } from './helpers/api-mock';
import { mockMemberInfo, setAuthCookie } from './helpers/auth-mock';

// ─── Mock 데이터 ──────────────────────────────────────────────────────────────

const TEACHER_MEMBER = {
  id: 1,
  email: 'teacher@test.com',
  name: '테스트선생님',
  role: 'ROLE_TEACHER',
};

// 온보딩 데이터 생성 함수
const makeTeacherOnboarding: (
  nextStep: TeacherOnboardingStepType | null
) => TeacherOnboardingDTO = (nextStep: TeacherOnboardingStepType | null) => {
  const nextStepIdx = nextStep
    ? TeacherOnboardingStepTypes.findIndex((step) => nextStep === step)
    : TeacherOnboardingStepTypes.length; // nextStep이 null이면 모든 단계 완료로 간주
  const completedSteps = TeacherOnboardingStepTypes.slice(0, nextStepIdx).map(
    (step, index) => ({
      stepName: step,
      description: `Step ${index + 1} 설명입니다.`,
      order: index + 1,
    })
  );
  return {
    completedSteps,
    nextStep,
    totalSteps: TeacherOnboardingStepTypes.length,
    currentProgress: completedSteps.length,
  };
};

const EMPTY_PAGEABLE = {
  pageNumber: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  content: [],
};

const TEACHER_STUDY_ROOM = { id: 1, name: '테스트 스터디룸' };

// ─── Mock 헬퍼 함수 ──────────────────────────────────────────────────────────

async function mockTeacherOnboardingGet(
  page: Page,
  nextStep: TeacherOnboardingStepType | null
) {
  await page.route('**/api/v1/teacher/onboarding', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 200,
          message: 'ok',
          data: makeTeacherOnboarding(nextStep),
        }),
      });
    } else {
      // POST - 기본 성공 응답
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{}',
      });
    }
  });
}

async function setTeacher(page: Page) {
  await setAuthCookie(page);
  await mockMemberInfo(page, TEACHER_MEMBER);
}

// ─── 강사 온보딩 ──────────────────────────────────────────────────────────────

test.describe('강사 온보딩', () => {
  test.beforeEach(async ({ page }) => {
    await setupCatchAll(page);
    await page.route('**/api/v1/teacher/study-rooms', async (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: okBody([]),
      })
    );
    await setTeacher(page);
  });
  test.describe('온보딩 UI 상태', () => {
    test('초기 상태: 스터디룸 생성 안내 타이틀이 보이고 닫기 버튼이 없다', async ({
      page,
    }) => {
      await mockTeacherOnboardingGet(page, 'CREATE_STUDY_ROOM');

      await page.goto(PRIVATE.DASHBOARD.INDEX);
      await page.waitForLoadState('networkidle');

      // 온보딩 컴포넌트 표시 확인
      await page.waitForSelector('[data-testid="teacher-onboarding"]');
      await expect(page.getByTestId('teacher-onboarding')).toBeVisible();

      await expect(
        page.getByText('먼저 나만의 스터디룸을 생성하고')
      ).toBeVisible();
      await expect(page.getByText(' 학생을 초대해주세요')).toBeVisible();

      // 스터디룸 생성이 off 상태
      await expect(
        page.getByTestId('onboarding-스터디룸 생성-incompleted')
      ).toBeVisible();

      // 학생 초대가 off 상태
      await expect(
        page.getByTestId('onboarding-학생 초대-incompleted')
      ).toBeVisible();

      // 닫기 버튼(tablet 이상)은 보이지 않아야 한다
      await expect(
        page.getByRole('button', { name: '닫기' })
      ).not.toBeVisible();
    });

    test('스터디룸 생성 완료 후: 스터디룸 생성이 completed 상태가 된다', async ({
      page,
    }) => {
      await mockTeacherOnboardingGet(page, 'INVITE_STUDENT');

      await page.goto(PRIVATE.DASHBOARD.INDEX);
      await page.waitForLoadState('networkidle');

      // 온보딩 컴포넌트 표시 확인
      await page.waitForSelector('[data-testid="teacher-onboarding"]');
      await expect(page.getByTestId('teacher-onboarding')).toBeVisible();

      await expect(
        page.getByText('먼저 나만의 스터디룸을 생성하고')
      ).toBeVisible();
      await expect(page.getByText(' 학생을 초대해주세요')).toBeVisible();

      // 스터디룸 생성이 off 상태
      await expect(
        page.getByTestId('onboarding-스터디룸 생성-completed')
      ).toBeVisible();

      // 학생 초대가 off 상태
      await expect(
        page.getByTestId('onboarding-학생 초대-incompleted')
      ).toBeVisible();

      // 닫기 버튼(tablet 이상)은 보이지 않아야 한다
      await expect(
        page.getByRole('button', { name: '닫기' })
      ).not.toBeVisible();
    });

    test('학생 초대 완료 후: 타이틀이 변경되고 닫기 버튼이 표시된다', async ({
      page,
    }) => {
      await mockTeacherOnboardingGet(page, 'CREATE_CLASS_NOTE');

      await page.goto(PRIVATE.DASHBOARD.INDEX);
      await page.waitForLoadState('networkidle');

      // 온보딩 컴포넌트 표시 확인
      await page.waitForSelector('[data-testid="teacher-onboarding"]');
      await expect(page.getByTestId('teacher-onboarding')).toBeVisible();

      await expect(
        page.getByText('이제 디에듀의 다양한 기능을 이용해보세요!')
      ).toBeVisible();

      // 닫기 버튼이 표시되어야 한다
      await expect(page.getByRole('button', { name: '닫기' })).toBeVisible();
    });

    test('모든 단계 완료 시: 온보딩 컴포넌트가 표시되지 않는다', async ({
      page,
    }) => {
      await mockTeacherOnboardingGet(
        page,
        null // isCompleted = true
      );

      await setTeacher(page);

      await page.goto(PRIVATE.DASHBOARD.INDEX);
      await page.waitForLoadState('networkidle');

      // 온보딩 컴포넌트 표시 확인
      await expect(page.getByTestId('teacher-onboarding')).not.toBeVisible();
    });

    test('닫기 버튼 클릭 시: 온보딩이 화면에서 사라진다', async ({ page }) => {
      // viewport를 tablet 이상으로 설정하여 닫기 버튼을 표시
      await page.setViewportSize({ width: 1280, height: 800 });

      await mockTeacherOnboardingGet(page, 'CREATE_CLASS_NOTE');

      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // 온보딩 컴포넌트 표시 확인
      await page.waitForSelector('[data-testid="teacher-onboarding"]');
      await expect(page.getByTestId('teacher-onboarding')).toBeVisible();

      await page.getByRole('button', { name: '닫기' }).click();

      await expect(page.getByTestId('teacher-onboarding')).not.toBeVisible();
    });
  });

  test.describe('온보딩 POST 요청', () => {
    test('스터디룸 생성 완료 시 CREATE_STUDY_ROOM stepType으로 POST 요청을 보낸다', async ({
      page,
    }) => {
      let onboardingPostBody: object | null = null;

      // 온보딩 nextStep이 CREATE_STUDY_ROOM인 상태
      await page.route('**/api/v1/teacher/onboarding', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              status: 200,
              message: 'ok',
              data: makeTeacherOnboarding('CREATE_STUDY_ROOM'),
            }),
          });
        } else {
          // POST 요청 캡처
          onboardingPostBody = route.request().postDataJSON() as object;
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: '{}',
          });
        }
      });

      // 스터디룸 목록 + 생성 API mock
      await page.route('**/api/v1/teacher/study-rooms', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              status: 200,
              message: 'ok',
              data: { id: 1, name: '새 스터디룸' },
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ status: 200, message: 'ok', data: [] }),
          });
        }
      });

      // 스터디룸 생성 후 이동 페이지 mock
      await page.route('**/api/v1/teacher/study-rooms/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 200, message: 'ok', data: {} }),
        });
      });

      await page.goto(PRIVATE.ROOM.CREATE);
      await page.waitForLoadState('networkidle', { timeout: 50000 });

      // Step 1: 이름과 설명 입력
      await page
        .getByPlaceholder('스터디룸 이름을 입력해주세요')
        .fill('테스트 스터디룸');
      await page
        .getByPlaceholder(/내신 성적 향상/)
        .fill('테스트 스터디룸 소개입니다.');

      // Step 1 → Step 2: "다음" 클릭
      await page.getByRole('button', { name: '다음' }).click();

      // Step 2: 필수 라디오 선택 (각 항목을 고유 텍스트로 클릭)
      await page.getByText('온라인').click(); // modality
      await page.getByText('1:1 수업 (과외, 멘토링)').click(); // classForm
      await page.getByText('수학').click(); // subjectType

      // schoolInfo: "기타" 선택 → grade 입력 불필요
      await page.getByText('학교를 선택하세요').click();
      await page.getByRole('option', { name: '기타' }).click();

      // "완료" 클릭
      await page.getByRole('button', { name: '완료' }).click();

      // onboarding POST 요청 검증
      await expect
        .poll(() => onboardingPostBody, { timeout: 5000 })
        .toEqual({ stepType: 'CREATE_STUDY_ROOM' });
    });

    test('수업노트 저장 완료 시 CREATE_CLASS_NOTE stepType으로 POST 요청을 보낸다', async ({
      page,
    }) => {
      let onboardingPostBody: object | null = null;

      await page.route('**/api/v1/teacher/onboarding', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              status: 200,
              message: 'ok',
              data: makeTeacherOnboarding('CREATE_CLASS_NOTE'),
            }),
          });
        } else {
          onboardingPostBody = route.request().postDataJSON() as object;
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: '{}',
          });
        }
      });

      // 수업노트 관련 API mock
      await page.route('**/api/v1/teacher/study-rooms', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 200,
            message: 'ok',
            data: [TEACHER_STUDY_ROOM],
          }),
        });
      });

      await page.route('**/api/v1/teacher/study-rooms/1/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 200,
            message: 'ok',
            data: {
              members: [],
              content: [],
              totalElements: 0,
              pageNumber: 0,
              size: 0,
              totalPages: 0,
            },
          }),
        });
      });

      // 수업노트 저장 API mock
      await page.route('**/api/v1/teacher/teaching-notes', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: '{}',
        });
      });

      await setTeacher(page);

      await page.goto(PRIVATE.NOTE.CREATE(1));
      await page.waitForLoadState('networkidle');

      // 제목 입력
      await page
        .getByPlaceholder('수업 노트의 제목을 입력해주세요.')
        .fill('테스트 수업 노트');

      // 내용 입력 (Tiptap editor)
      const editor = page.locator('[contenteditable="true"]').first();
      await editor.click();
      await page.keyboard.type('테스트 수업 내용입니다.');

      // 공개 범위 선택 (Select 컴포넌트 트리거 → 옵션 클릭)
      await page.getByText('범위를 선택하세요').click();
      await page.getByRole('option', { name: '전체 공개' }).click();

      // 저장하기 클릭
      await page.getByRole('button', { name: '저장하기' }).click();

      await expect
        .poll(() => onboardingPostBody, { timeout: 5000 })
        .toEqual({ stepType: 'CREATE_CLASS_NOTE' });
    });

    test('과제 저장 완료 시 ASSIGN_ASSIGNMENT stepType으로 POST 요청을 보낸다', async ({
      page,
    }) => {
      let onboardingPostBody: object | null = null;

      await page.route('**/api/v1/teacher/onboarding', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              status: 200,
              message: 'ok',
              data: makeTeacherOnboarding('ASSIGN_ASSIGNMENT'),
            }),
          });
        } else {
          onboardingPostBody = route.request().postDataJSON() as object;
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: '{}',
          });
        }
      });

      // 과제 관련 API mock
      await page.route('**/api/v1/teacher/study-rooms/1/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 200,
            message: 'ok',
            data: {
              members: [],
              content: [],
              totalElements: 0,
              pageNumber: 0,
              size: 0,
              totalPages: 0,
            },
          }),
        });
      });

      // 과제 생성 API mock
      await page.route(
        '**/api/v1/teacher/study-rooms/1/homeworks',
        async (route) => {
          if (route.request().method() === 'POST') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                status: 200,
                message: 'ok',
                data: { id: 1 },
              }),
            });
          } else {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                status: 200,
                message: 'ok',
                data: EMPTY_PAGEABLE,
              }),
            });
          }
        }
      );

      await setTeacher(page);

      await page.goto(PRIVATE.HOMEWORK.CREATE(1));
      await page.waitForLoadState('networkidle');

      // 제목 입력
      await page
        .getByPlaceholder('과제의 제목을 입력해주세요.')
        .fill('테스트 과제');

      // 내용 입력 (Tiptap editor)
      const editor = page.locator('[contenteditable="true"]').first();
      await editor.click();
      await page.keyboard.type('테스트 과제 내용입니다.');

      // 마감 기한 입력 (미래 날짜)
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const deadlineValue = futureDate.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:MM'
      await page.locator('input[type="datetime-local"]').fill(deadlineValue);

      // 저장하기 클릭
      await page.getByRole('button', { name: '저장하기' }).click();

      await expect
        .poll(() => onboardingPostBody, { timeout: 5000 })
        .toEqual({ stepType: 'ASSIGN_ASSIGNMENT' });
    });

    test('피드백 작성 완료 시 GIVE_FEEDBACK stepType으로 POST 요청을 보낸다', async ({
      page,
    }) => {
      let onboardingPostBody: object | null = null;

      await page.route('**/api/v1/teacher/onboarding', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              status: 200,
              message: 'ok',
              data: makeTeacherOnboarding('GIVE_FEEDBACK'),
            }),
          });
        } else {
          onboardingPostBody = route.request().postDataJSON() as object;
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: '{}',
          });
        }
      });

      // 과제 상세 조회 API mock (학생 제출물 포함)
      await page.route(
        '**/api/v1/teacher/study-rooms/1/homeworks/1',
        async (route) => {
          if (route.request().method() === 'GET') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                status: 200,
                message: 'ok',
                data: {
                  homework: {
                    id: 1,
                    teacherName: '테스트선생님',
                    title: '테스트 과제',
                    content: '{}',
                    deadline: '2026-12-31T23:59:59',
                    modifiedAt: '2026-01-01T00:00:00',
                    reminderOffsets: [],
                    teachingNoteInfoList: [],
                  },
                  homeworkStudents: [
                    {
                      id: 1,
                      studentName: '테스트학생',
                      readAt: null,
                      studentId: 2,
                      status: 'SUBMIT',
                      submission: {
                        content: '{}',
                        resolvedContent: null,
                        modifiedSubmissionAt: '2026-01-02T12:00:00',
                      },
                      feedback: null,
                    },
                  ],
                },
              }),
            });
          } else {
            await route.continue();
          }
        }
      );

      // 피드백 POST API mock
      await page.route(
        '**/api/v1/teacher/study-rooms/1/homework-students/1/feedback',
        async (route) => {
          if (route.request().method() === 'POST') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: '{}',
            });
          } else {
            await route.continue();
          }
        }
      );

      await setTeacher(page);

      await page.goto(PRIVATE.HOMEWORK.DETAIL(1, 1));
      await page.waitForLoadState('networkidle');

      // 케밥 메뉴 클릭 → "피드백 하기" 클릭
      await page.getByAltText('study-notes').click();
      await page.getByText('피드백 하기').click();

      // 피드백 내용 입력 (Tiptap editor)
      const feedbackEditor = page.locator('[contenteditable="true"]').first();
      await feedbackEditor.click();
      await page.keyboard.type('테스트 피드백 내용입니다.');

      // 작성하기 클릭
      await page.getByRole('button', { name: '작성하기' }).click();

      await expect
        .poll(() => onboardingPostBody, { timeout: 5000 })
        .toEqual({ stepType: 'GIVE_FEEDBACK' });
    });
  });
});
