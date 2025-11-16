const IMG = {
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
  },
} as const;

export const CHARACTER_LIST = Object.values(IMG.CHARACTER);
