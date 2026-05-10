export const IMG = {
  CHARACTER: {
    TEACHER: {
      label: '선생님',
      src: '/character/img_signup_type01.png',
    },
    STUDENT: {
      label: '학생',
      src: '/character/img_signup_type02.png',
    },
    PARENT: {
      label: '학부모',
      src: '/character/img_signup_type03.png',
    },
    HEADER: {
      label: '헤더',
      src: '/img_header_profile.svg',
    },
  },
} as const;

export const CHARACTER_LIST = Object.values(IMG.CHARACTER);

// 프로필 이미지 공통 관리
export const DEFAULT_PROFILE_IMAGE = {
  TEACHER: '/character/img_profile_teacher01.png',
  STUDENT: '/character/img_profile_student01.png',
  PARENT: '/character/img_signup_type03.png',
  MEMBER: '/character/img_signup_type01.png',
  COMMON: '/character/img_signup_type01.png',
  HEADER: '/img_header_profile.svg',
} as const;

export const getProfileImageSrc = (
  profileImageUrl: string | null | undefined,
  fallbackImageUrl: string = DEFAULT_PROFILE_IMAGE.COMMON
): string => {
  const trimmedProfileImageUrl = profileImageUrl?.trim();

  return trimmedProfileImageUrl || fallbackImageUrl;
};
