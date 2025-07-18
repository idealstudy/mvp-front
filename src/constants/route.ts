export const ROUTE = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/register',
  DASHBOARD: {
    HOME: '/dashboard',
    STUDY_ROOM: {
      DETAIL: (id: string) => `/dashboard/study-rooms/${id}`,
      CREATE: '/dashboard/study-rooms/create',
    },
    QUESTIONS: {
      LIST: '/dashboard/questions',
    },
    SETTINGS: '/dashboard/settings',
  },
  BIZ: '#',
} as const;
