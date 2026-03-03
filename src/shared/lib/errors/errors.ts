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
    case 'MEMBER_NOT_EXIST':
      return 'AUTH';

    default:
      return 'UNKNOWN';
  }
}
