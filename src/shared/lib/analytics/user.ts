import type { Role } from '@/entities/member';

import {
  resetAmplitudeUser,
  setAmplitudeUser,
  setAmplitudeUserProperties,
} from './amplitude';

/**
 * 내부 역할(ROLE_*)을 analytics user_type으로 변환
 *
 * @param role - 내부 역할 코드 (ROLE_TEACHER, ROLE_STUDENT, ROLE_PARENT, ROLE_ADMIN)
 * @returns user_type ('teacher', 'student', 'guardian', 'admin', 'not')
 *
 * 공통 파라미터 규칙:
 * - teacher: 선생님 (관리자 포함)
 * - student: 학생
 * - guardian: 보호자
 * - admin: 관리자
 * - not: 비로그인 사용자
 */
export const getUserType = (
  role: string | null | undefined
): 'teacher' | 'student' | 'guardian' | 'admin' | 'not' => {
  if (!role) return 'not';

  switch (role) {
    case 'ROLE_TEACHER':
      return 'teacher';
    case 'ROLE_STUDENT':
      return 'student';
    case 'ROLE_PARENT':
      return 'guardian';
    case 'ROLE_ADMIN':
      return 'admin';
    default:
      return 'not';
  }
};

export const setAnalyticsUser = (userId: string, role?: Role | null): void => {
  setAmplitudeUser(userId);
  setAmplitudeUserProperties({ user_type: getUserType(role) });
};

export const resetAnalyticsUser = (): void => {
  resetAmplitudeUser();
};
