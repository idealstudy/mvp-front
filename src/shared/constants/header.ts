// 역할별 메타 정보
export const ROLE_META_MAP = {
  ROLE_ADMIN: {
    label: '관리자',
    className: 'border-white text-white',
  },
  ROLE_STUDENT: {
    label: '학생',
    className: 'border-white text-white',
  },
  ROLE_PARENT: {
    label: '보호자',
    className: 'border-orange-scale-orange-20 text-orange-scale-orange-20',
  },
  ROLE_TEACHER: {
    label: '선생님',
    className: 'border-key-color-primary text-key-color-primary',
  },
  ROLE_MEMBER: {
    label: '회원',
    className: 'border-white text-white',
  },
} as const;

// 버튼 스타일
export const BUTTON_BASE =
  'cursor-pointer border px-8 content-center rounded-sm h-[46px] text-white';
