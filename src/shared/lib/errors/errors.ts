/* -------------------------------------------------------- 
"사용자가 입력값을 고쳐서 해결할 수 있는가?" → Yes: FIELD

"페이지를 새로고침하거나 목록으로 돌아가야 하는가?" → Yes: CONTEXT

"다시 로그인하거나 권한을 요청해야 하는가?" → Yes: AUTH
----------------------------------------------------------*/

export type ApiErrorType = 'FIELD' | 'CONTEXT' | 'AUTH' | 'UNKNOWN';

// qna 관련 에러
export function classifyQnaError(code?: string): ApiErrorType {
  switch (code) {
    // FIELD (폼에서 복구 가능)
    case 'TEACHING_NOTE_STUDY_ROOM_MISMATCH':
    case 'TEACHING_NOTE_NOT_FOUND':
      return 'FIELD';

    // CONTEXT (리소스 소멸 / 페이지 무효)
    case 'QNA_CONTEXT_NOT_FOUND':
    case 'QNA_MESSAGE_NOT_FOUND':
    case 'STUDY_ROOM_NOT_EXIST':
      return 'CONTEXT';

    // AUTH (권한 문제)
    case 'STUDENT_NOT_IN_STUDY_ROOM':
    case 'MEMBER_NOT_EXIST':
    case 'QNA_MESSAGE_UPDATE_FORBIDDEN':
    case 'QNA_MESSAGE_DELETE_FORBIDDEN':
    case 'QNA_CONTEXT_UPDATE_FORBIDDEN':
      return 'AUTH';

    default:
      return 'UNKNOWN';
  }
}

// homework 관련 에러
export function classifyHomeworkError(code?: string): ApiErrorType {
  switch (code) {
    case 'STUDY_ROOM_NOT_EXIST':
    case 'HOMEWORK_STUDENT_NOT_EXIST':
    case 'HOMEWORK_NOT_EXIST':
      return 'CONTEXT';

    case 'MEMBER_NOT_EXIST':
      return 'AUTH';

    default:
      return 'UNKNOWN';
  }
}

// mypage 관련 에러
export function classifyMypageError(code?: string): ApiErrorType {
  switch (code) {
    // FIELD (폼에서 복구 가능)
    case 'IS_CURRENT_CANNOT_BE_SET_WITH_END_DATE':
    case 'CAREER_LIMIT_EXCEEDED':
    case 'REPRESENTATIVE_LIMIT_EXCEEDED':
      return 'FIELD';

    // CONTEXT (리소스 소멸 / 페이지 무효)
    case 'CAREER_NOT_EXIST':
    case 'TEACHING_NOTE_NOT_EXIST':
      return 'CONTEXT';

    // AUTH (권한 문제)
    case 'MEMBER_NOT_EXIST':
    case 'CAREER_AND_TEACHER_NOT_MATCH':
      return 'AUTH';

    default:
      return 'UNKNOWN';
  }
}

// Preview 페이지 관련 에러
export function classifyPreviewError(code?: string): ApiErrorType {
  switch (code) {
    case 'STUDY_ROOM_NOT_EXIST':
      return 'CONTEXT';

    case 'MEMBER_NOT_EXIST':
      return 'AUTH';

    default:
      return 'UNKNOWN';
  }
}

// 수업노트 댓글 관련 에러
export function classifyStudyNoteCommentError(code?: string): ApiErrorType {
  switch (code) {
    case 'MEMBER_NOT_EXIST':
      return 'AUTH';

    case 'TEACHING_NOTE_NOT_EXIST':
    case 'TEACHING_NOTE_COMMENT_NOT_EXIST':
    case 'TEACHING_NOTE_COMMENT_ALREADY_DELETED':
      return 'CONTEXT';

    default:
      return 'UNKNOWN';
  }
}

// column 관련 에러
export function classifyColumnError(code?: string): ApiErrorType {
  switch (code) {
    // CONTEXT (리소스 소멸 / 페이지 무효)
    case 'COLUMN_ARTICLE_NOT_EXIST':
    case 'COLUMN_ARTICLE_ALREADY_APPROVED':
    case 'COLUMN_ARTICLE_NOT_OWNED':
      return 'CONTEXT';

    // AUTH (권한 문제)
    case 'MEMBER_NOT_EXIST':
      return 'AUTH';

    default:
      return 'UNKNOWN';
  }
}

// open challenge 관련 에러
export function classifyOpenChallengeError(code?: string): ApiErrorType {
  switch (code) {
    case 'CHALLENGE_NOT_FOUND':
    case 'CHALLENGE_ATTEMPT_NOT_FOUND':
    case 'CHALLENGE_REVIEW_NOT_FOUND':
      return 'CONTEXT';

    case 'ANSWER_NOT_SELECTED':
    case 'CHALLENGE_ALREADY_COMPLETED':
    case 'CHALLENGE_ATTEMPT_ANSWER_REQUIRED':
    case 'CHALLENGE_ATTEMPT_INVALID_ANSWER':
    case 'CHALLENGE_REVIEW_ALREADY_EXISTS':
    case 'CHALLENGE_FEEDBACK_ALREADY_EXISTS':
    case 'CHALLENGE_QUESTION_BODY_REQUIRED':
    case 'CHALLENGE_INVALID_CHOICE':
    case 'CHALLENGE_MEDIA_NOT_FOUND':
    case 'CHALLENGE_NOT_EDITABLE':
    case 'CHALLENGE_NOT_DELETABLE':
    case 'AI_COACHING_MESSAGE_TOO_LONG':
    case 'AI_COACHING_RATE_LIMITED':
    case 'AI_COACHING_PREFERENCE_INVALID_VALUE':
      return 'FIELD';

    case 'MEMBER_NOT_EXIST':
    case 'CHALLENGE_ATTEMPT_FORBIDDEN':
    case 'CHALLENGE_ATTEMPT_NOT_OWNED':
    case 'CHALLENGE_REVIEW_FORBIDDEN':
    case 'AI_COACHING_SESSION_NOT_OWNED':
    case 'AI_COACHING_ACCESS_DENIED_NOT_IN_STUDY_ROOM':
      return 'AUTH';

    case 'CHALLENGE_ATTEMPT_NOT_IN_PROGRESS':
    case 'CHALLENGE_ATTEMPT_ALREADY_COMPLETED':
    case 'AI_COACHING_SESSION_NOT_FOUND':
    case 'AI_COACHING_SESSION_ALREADY_EXISTS':
    case 'AI_COACHING_SESSION_FINISHED':
    case 'AI_COACHING_PROVIDER_FAILED':
      return 'CONTEXT';

    default:
      return 'UNKNOWN';
  }
}

// inquiry 관련 에러
export function classifyInquiryError(code?: string): ApiErrorType {
  switch (code) {
    // CONTEXT (리소스 소멸 / 페이지 무효)
    case 'INQUIRY_NOT_FOUND':
    case 'INQUIRY_ANSWER_NOT_FOUND':
    case 'INQUIRY_ANSWER_ALREADY_EXISTS':
    case 'STUDY_ROOM_NOT_EXIST':
    case 'INQUIRY_ACCESS_FORBIDDEN':
    case 'INQUIRY_ANSWER_FORBIDDEN':
      return 'CONTEXT';

    // AUTH (권한 문제)
    case 'MEMBER_NOT_EXIST':
      return 'AUTH';

    default:
      return 'UNKNOWN';
  }
}

// 부모님 대시보드 - 학생연결 관련 에러
export function classifyConnectionError(code?: string): ApiErrorType {
  switch (code) {
    // FIELD (연결 대상 변경 등 사용자가 입력/선택을 바꿔 복구 가능)
    case 'DUPLICATE_CONNECTION_REQUEST':
    case 'CONNECTION_LIMIT_EXCEEDED_SELF':
    case 'CONNECTION_LIMIT_EXCEEDED_TARGET':
    case 'INVALID_CONNECTION_RELATION':
    case 'MEMBER_NOT_EXIST':
      return 'FIELD';

    // CONTEXT (이미 처리되었거나 삭제되어 현재 요청 컨텍스트가 유효하지 않음)
    case 'INVALID_CONNECTION_STATE':
    case 'CONNECTION_NOT_FOUND':
      return 'CONTEXT';

    default:
      return 'UNKNOWN';
  }
}

// 스터디노트 관련 에러
export function classifyStudyNoteError(code?: string): ApiErrorType {
  switch (code) {
    // FIELD
    case 'DUPLICATED_TEACHING_NOTE_TITLE':
    case 'TEACHING_NOTE_GROUP_NOT_EXIST':
      return 'FIELD';

    // CONTEXT
    case 'STUDY_ROOM_NOT_EXIST':
    case 'TEACHING_NOTE_NOT_EXIST':
      return 'CONTEXT';

    // AUTH
    case 'MEMBER_NOT_EXIST':
      return 'AUTH';

    default:
      return 'UNKNOWN';
  }
}

// 탈퇴 관련 에러
export function classifyWithdrawError(code?: string): ApiErrorType {
  switch (code) {
    case 'MEMBER_NOT_EXIST':
      return 'AUTH';

    default:
      return 'UNKNOWN';
  }
}
