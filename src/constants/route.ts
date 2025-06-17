export const ROUTE = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/register',
  DASHBOARD: {
    HOME: '/dashboard',
    CONNECTIONS: {
      LIST: '/dashboard/connections',
    },
    LOGS: {
      LIST: '/dashboard/logs',
      DETAIL: (id: string) => `/dashboard/logs/${id}`,
    },
    SETTINGS: '/dashboard/settings',
  },
  BIZ: '#',
} as const;
