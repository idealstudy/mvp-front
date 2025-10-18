export const ROUTE = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/register',
  DASHBOARD: {
    HOME: '/dashboard',
    STUDYROOM: {
      DETAIL: (id: number) => `/studyrooms/${id}/studynotes`,
      CREATE: '/studyrooms/create',
    },
    STUDYNOTE: {
      CREATE: '/dashboard/studynote/create',
      DETAIL: (id: number) => `/dashboard/studynote/${id}`,
    },
    QUESTIONS: {
      DETAIL: (studyroomId: number, contextId: number) =>
        `/dashboard/studyrooms/${studyroomId}/qna/${contextId}`,
      CREATE: (studyroomId: number) =>
        `/dashboard/studyrooms/${studyroomId}/qna/write`,
    },
    SETTINGS: '/dashboard/settings',
  },
  BIZ: '#',
} as const;
