import { ShowErrorToast, getApiError } from '@/shared/lib';
import * as Sentry from '@sentry/nextjs';

import { ApiErrorType } from './errors';

// 아까 만든 타입 위치

interface ErrorActions {
  onField?: (message: string) => void;
  onContext?: (message: string) => void;
  onAuth?: (message: string) => void;
  onUnknown?: (message: string) => void;
}

/**
 * API 에러를 분류하고 타입에 따른 공통 액션을 수행합니다.
 * @param error - mutation/query에서 넘어온 error 객체
 * @param classifier - 도메인별 에러 분류 함수 (classifyQnaError 등)
 * @param actions - 타입별로 실행할 콜백 함수들
 */
export const handleApiError = (
  error: unknown,
  classifier: (code?: string) => ApiErrorType,
  actions: ErrorActions
) => {
  const apiError = getApiError(error);

  // 1. API 에러 형식이 아닐 때
  if (!apiError) {
    Sentry.captureException(error);
    ShowErrorToast(
      'UNKNOWN',
      '네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.'
    );
    actions.onUnknown?.('Unknown Error');
    return;
  }

  const type = classifier(apiError.code);

  // 2. 일단 에러 메시지는 토스트로 공통 출력
  ShowErrorToast('API_ERROR', apiError.message);

  // 3. 타입별 액션 수행
  switch (type) {
    case 'FIELD':
      // 주로 편집 상태 유지, 필드 에러 표시
      actions.onField?.(apiError.message);
      break;

    case 'CONTEXT':
      // 주로 목록으로 리다이렉트
      actions.onContext?.(apiError.message);
      break;

    case 'AUTH':
      // 주로 권한 경고 후 초기화
      actions.onAuth?.(apiError.message);
      break;

    default:
      Sentry.captureException(error);
      actions.onUnknown?.(apiError.message);
      break;
  }
};
