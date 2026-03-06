/**
 * GA4 이벤트 추적 헬퍼 함수
 *
 * 각 이벤트별로 타입 안전한 헬퍼 함수를 제공합니다.
 * 사용 시 자동으로 user_type이 추가됩니다.
 */
import type { Role } from '@/entities/member';

import { getGaUserType, pushEvent } from '../gtm';
import { GA4_EVENTS, withUserType } from './events';
import type {
  AuthSignupStepEnterParams,
  HomeworkCreateParams,
  HomeworkReplyParams,
  HomeworkSubmitParams,
  QuestionCreateParams,
  ReplyCreateParams,
  StudentInviteParams,
  StudynoteCreateEnterParams,
  StudynoteCreateParams,
  StudynoteDuplicateParams,
  StudynoteFilterParams,
  StudynoteGroupParams,
  StudyroomCreateParams,
  StudyroomEndParams,
  StudyroomTitleUpdateParams,
} from './events';

// ==================== 인증 이벤트 ====================
export const trackAuthLoginClick = () => {
  pushEvent(GA4_EVENTS.AUTH_LOGIN_CLICK, withUserType({}));
};

export const trackAuthLoginSuccess = (role?: Role | null) => {
  pushEvent(GA4_EVENTS.AUTH_LOGIN_SUCCESS, withUserType({}, role));
};

export const trackAuthLoginFail = () => {
  pushEvent(GA4_EVENTS.AUTH_LOGIN_FAIL, withUserType({}));
};

export const trackAuthKakaoLoginClick = () => {
  pushEvent(GA4_EVENTS.AUTH_KAKAO_LOGIN_CLICK, withUserType({}));
};

export const trackAuthSignupClick = () => {
  pushEvent(GA4_EVENTS.AUTH_SIGNUP_CLICK, withUserType({}));
};

export const trackAuthSignupSuccess = (
  role?: Role | null,
  method: 'email' | 'kakao' = 'email'
) => {
  pushEvent(GA4_EVENTS.AUTH_SIGNUP_SUCCESS, withUserType({ method }, role));
};

export const trackAuthSignupFail = (method: 'email' | 'kakao' = 'email') => {
  pushEvent(GA4_EVENTS.AUTH_SIGNUP_FAIL, withUserType({ method }));
};

export const trackAuthSignupStepEnter = (
  step: AuthSignupStepEnterParams['step']
) => {
  pushEvent(GA4_EVENTS.AUTH_SIGNUP_STEP_ENTER, withUserType({ step }));
};

// ==================== GNB 이벤트 ====================

export const trackGnbLogoClick = (role?: Role | null) => {
  pushEvent(GA4_EVENTS.GNB_LOGO_CLICK, withUserType({}, role));
};

export const trackGnbAlarmClick = (role?: Role | null) => {
  pushEvent(GA4_EVENTS.GNB_ALARM_CLICK, withUserType({}, role));
};

export const trackGnbProfileClick = (role?: Role | null) => {
  pushEvent(GA4_EVENTS.GNB_PROFILE_CLICK, withUserType({}, role));
};

export const trackGnbLogoutClick = (role?: Role | null) => {
  pushEvent(GA4_EVENTS.GNB_LOGOUT_CLICK, withUserType({}, role));
};

export const trackGnbMenuClick = (role?: Role | null) => {
  pushEvent(GA4_EVENTS.GNB_MENU_CLICK, withUserType({}, role));
};

// ==================== 대시보드 이벤트 ====================

export const trackDashboardStudyroomCreateClick = (role?: Role | null) => {
  pushEvent(
    GA4_EVENTS.DASHBOARD_STUDYROOM_CREATE_CLICK,
    withUserType({}, role)
  );
};

export const trackDashboardMainBannerClick = (role?: Role | null) => {
  pushEvent(GA4_EVENTS.DASHBOARD_MAIN_BANNER_CLICK, withUserType({}, role));
};

export const trackDashboardStudynoteClick = (role?: Role | null) => {
  pushEvent(GA4_EVENTS.DASHBOARD_STUDYNOTE_CLICK, withUserType({}, role));
};

// ==================== 페이지뷰 이벤트 ====================

export const trackPageView = (
  pageName: string,
  params?: Record<string, unknown>,
  role?: Role | null
) => {
  pushEvent(`${pageName}_page_view`, {
    user_type: getGaUserType(role),
    ...params,
  });
};

// ==================== 스터디룸 이벤트 ====================

export const trackStudyroomCreateClick = (
  params: Omit<StudyroomCreateParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDYROOM_CREATE_CLICK, withUserType(params, role));
};

export const trackStudyroomCreateSuccess = (
  params: Omit<StudyroomCreateParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDYROOM_CREATE_SUCCESS, withUserType(params, role));
};

export const trackStudyroomStudentInviteOpen = (
  roomId: number,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYROOM_STUDENT_INVITE_OPEN,
    withUserType({ room_id: roomId }, role)
  );
};

export const trackStudyroomTabClick = (
  tabType: 'studynote' | 'student' | 'question' | 'homework',
  roomId: number,
  role?: Role | null
) => {
  const eventMap = {
    studynote: GA4_EVENTS.STUDYROOM_STUDYNOTE_TAB_CLICK,
    student: GA4_EVENTS.STUDYROOM_STUDENT_TAB_CLICK,
    question: GA4_EVENTS.STUDYROOM_QUESTION_TAB_CLICK,
    homework: GA4_EVENTS.STUDYROOM_HOMEWORK_TAB_CLICK,
  };

  pushEvent(eventMap[tabType], withUserType({ room_id: roomId }, role));
};

export const trackStudyroomTitleUpdateClick = (
  params: Omit<StudyroomTitleUpdateParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYROOM_TITLE_UPDATE_CLICK,
    withUserType(params, role)
  );
};

export const trackStudyroomTitleUpdateSuccess = (
  params: Omit<StudyroomTitleUpdateParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYROOM_TITLE_UPDATE_SUCCESS,
    withUserType(params, role)
  );
};

export const trackStudyroomTitleUpdateFail = (
  params: Omit<StudyroomTitleUpdateParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDYROOM_TITLE_UPDATE_FAIL, withUserType(params, role));
};

export const trackStudyroomDeleteClick = (
  roomId: number,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYROOM_DELETE_CLICK,
    withUserType({ room_id: roomId }, role)
  );
};

export const trackStudyroomDeleteSuccess = (
  roomId: number,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYROOM_DELETE_SUCCESS,
    withUserType({ room_id: roomId }, role)
  );
};

export const trackStudyroomDeleteFail = (
  roomId: number,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYROOM_DELETE_FAIL,
    withUserType({ room_id: roomId }, role)
  );
};

export const trackStudyroomDeleteCancelClick = (
  roomId: number,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYROOM_DELETE_CANCEL_CLICK,
    withUserType({ room_id: roomId }, role)
  );
};

// ==================== 수업노트 이벤트 ====================

export const trackStudynoteCreateEnter = (
  params: Omit<StudynoteCreateEnterParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYROOM_STUDYNOTE_CREATE_ENTER,
    withUserType(params, role)
  );
};

export const trackStudynoteClick = (
  roomId: number,
  noteId: number,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYROOM_STUDYNOTE_CLICK,
    withUserType({ room_id: roomId, note_id: noteId }, role)
  );
};

export const trackStudynoteCreateClick = (
  params: Omit<StudynoteCreateParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDYNOTE_CREATE_CLICK, withUserType(params, role));
};

export const trackStudynoteCreateSuccess = (
  params: Omit<StudynoteCreateParams, 'user_type'> & {
    group_id: number | null;
  },
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDYNOTE_CREATE_SUCCESS, withUserType(params, role));
};

export const trackStudynoteCreateFail = (
  params: Omit<StudynoteCreateParams, 'user_type'> & {
    group_id: number | null;
  },
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDYNOTE_CREATE_FAIL, withUserType(params, role));
};

export const trackStudynoteDuplicateClick = (
  params: Omit<StudynoteDuplicateParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDYNOTE_DUPLICATE_CLICK, withUserType(params, role));
};

export const trackStudynoteDuplicateSuccess = (
  params: Omit<StudynoteDuplicateParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDYNOTE_DUPLICATE_SUCCESS, withUserType(params, role));
};

export const trackStudynoteDuplicateFail = (
  params: Omit<StudynoteDuplicateParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDYNOTE_DUPLICATE_FAIL, withUserType(params, role));
};

// ==================== 노트 그룹 이벤트 ====================

export const trackStudynoteGroupCreateClick = (
  params: Omit<StudynoteGroupParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYNOTE_GROUP_CREATE_CLICK,
    withUserType(params, role)
  );
};

export const trackStudynoteGroupCreateSuccess = (
  params: Omit<StudynoteGroupParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYNOTE_GROUP_CREATE_SUCCESS,
    withUserType(params, role)
  );
};

export const trackStudynoteGroupCreateFail = (
  params: Omit<StudynoteGroupParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDYNOTE_GROUP_CREATE_FAIL, withUserType(params, role));
};

export const trackStudynoteGroupTitleUpdateClick = (
  params: Omit<StudynoteGroupParams, 'user_type'> & { group_id: number },
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYNOTE_GROUP_TITLE_UPDATE_CLICK,
    withUserType(params, role)
  );
};

export const trackStudynoteGroupTitleUpdateSuccess = (
  params: Omit<StudynoteGroupParams, 'user_type'> & { group_id: number },
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYNOTE_GROUP_TITLE_UPDATE_SUCCESS,
    withUserType(params, role)
  );
};

export const trackStudynoteGroupTitleUpdateFail = (
  params: Omit<StudynoteGroupParams, 'user_type'> & { group_id: number },
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYNOTE_GROUP_TITLE_UPDATE_FAIL,
    withUserType(params, role)
  );
};

export const trackStudynoteGroupDeleteClick = (
  params: Omit<StudynoteGroupParams, 'user_type'> & { group_id: number },
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYNOTE_GROUP_DELETE_CLICK,
    withUserType(params, role)
  );
};

export const trackStudynoteGroupDeleteSuccess = (
  params: Omit<StudynoteGroupParams, 'user_type'> & { group_id: number },
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYNOTE_GROUP_DELETE_SUCCESS,
    withUserType(params, role)
  );
};

export const trackStudynoteGroupDeleteFail = (
  params: Omit<StudynoteGroupParams, 'user_type'> & { group_id: number },
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDYNOTE_GROUP_DELETE_FAIL, withUserType(params, role));
};

export const trackStudynoteGroupDeleteCancelClick = (
  params: Omit<StudynoteGroupParams, 'user_type'> & { group_id: number },
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYNOTE_GROUP_DELETE_CANCEL_CLICK,
    withUserType(params, role)
  );
};

// ==================== 학생 이벤트 ====================

export const trackStudentInviteClick = (
  params: Omit<StudentInviteParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDENT_INVITE_CLICK, withUserType(params, role));
};

export const trackStudentInviteSuccess = (
  params: Omit<StudentInviteParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDENT_INVITE_SUCCESS, withUserType(params, role));
};

export const trackStudentInviteFail = (
  params: Omit<StudentInviteParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDENT_INVITE_FAIL, withUserType(params, role));
};

export const trackStudentRemoveConfirmed = (
  roomId: number,
  studentId: number,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDENT_REMOVE_CONFIRMED,
    withUserType({ room_id: roomId, student_id: studentId }, role)
  );
};

export const trackStudyroomStudentEndConfirmed = (
  params: Omit<StudyroomEndParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYROOM_STUDENT_END_CONFIRMED,
    withUserType(params, role)
  );
};

export const trackStudyroomStudentProfileEnter = (
  roomId: number,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYROOM_STUDENT_PROFILE_ENTER,
    withUserType({ room_id: roomId }, role)
  );
};

// ==================== 질문 이벤트 ====================

export const trackQuestionCreateClick = (
  params: Omit<QuestionCreateParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.QUESTION_CREATE_CLICK, withUserType(params, role));
};

export const trackQuestionClick = (
  roomId: number,
  questionId: number,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYROOM_QUESTION_CLICK,
    withUserType({ room_id: roomId, question_id: questionId }, role)
  );
};

export const trackReplyCreateClick = (
  params: Omit<ReplyCreateParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.REPLY_CREATE_CLICK, withUserType(params, role));
};

// ==================== 과제 이벤트 ====================

export const trackHomeworkCreateClick = (
  params: Omit<HomeworkCreateParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.HOMEWORK_CREATE_CLICK, withUserType(params, role));
};

export const trackHomeworkClick = (
  roomId: number,
  userId: number,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYROOM_HOMEWORK_CLICK,
    withUserType({ room_id: roomId, user_id: userId }, role)
  );
};

export const trackHomeworkSubmitClick = (
  params: Omit<HomeworkSubmitParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.HOMEWORK_SUBMIT_CLICK, withUserType(params, role));
};

export const trackHomeworkReplyCreateClick = (
  params: Omit<HomeworkReplyParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.HOMEWORK_REPLY_CREATE_CLICK, withUserType(params, role));
};

// ==================== 검색/필터 이벤트 ====================

export const trackStudynoteListArrangeFilterClick = (
  params: Omit<StudynoteFilterParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(
    GA4_EVENTS.STUDYNOTE_LIST_ARRANGE_FILTER_CLICK,
    withUserType(params, role)
  );
};

export const trackStudynoteListSearchClick = (
  params: Omit<StudynoteFilterParams, 'user_type'>,
  role?: Role | null
) => {
  pushEvent(GA4_EVENTS.STUDYNOTE_LIST_SEARCH_CLICK, withUserType(params, role));
};

// ==================== 홈 이벤트 ====================
export const trackHomeDedu101Click = (source: 'hero' | 'floating_cta') => {
  pushEvent(GA4_EVENTS.HOME_DEDU101_CLICK, withUserType({ source }));
};

export const trackHomeStartClick = () => {
  pushEvent(GA4_EVENTS.HOME_START_CLICK, withUserType({}));
};
