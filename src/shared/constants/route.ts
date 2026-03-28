/* ─────────────────────────────────────────────────────
 * CORE ROUTES
 * ────────────────────────────────────────────────────*/
const CORE = {
  INDEX: '/',
  LOGIN: '/login',
  SIGNUP: '/register',
  LIST: {
    TEACHERS: '/list/teachers',
    STUDY_ROOMS: '/list/study-rooms',
  },
  BIZ: '#',
  INVITE: {
    ERROR: (reason: string) => `/invite/error?reason=${reason}`,
    SUCCESS: (studyRoomId: number) =>
      `/invite/success?studyRoomId=${studyRoomId}`,
  },
} as const;

/* ─────────────────────────────────────────────────────
 * DASHBOARD
 * ────────────────────────────────────────────────────*/
const DASHBOARD = {
  INDEX: '/dashboard',
  INQUIRY: '/dashboard/inquiry',
  SETTINGS: '/dashboard/settings',
} as const;

/* ─────────────────────────────────────────────────────
 * STUDY ROOM
 * ────────────────────────────────────────────────────*/
const ROOM = {
  DETAIL: (id: number) => `/study-rooms/${id}/note`,
  CREATE: '/study-rooms/new',
} as const;

/* ─────────────────────────────────────────────────────
 * QUESTIONS
 * ────────────────────────────────────────────────────*/
const QUESTIONS = {
  DETAIL: (studyroomId: number, contextId: number) =>
    `/study-rooms/${studyroomId}/qna/${contextId}`,
  CREATE: (studyroomId: number) => `/study-rooms/${studyroomId}/qna/new`,
  LIST: (studyroomId: number) => `/study-rooms/${studyroomId}/qna`,
} as const;

/* ─────────────────────────────────────────────────────
 * STUDY NOTE
 * ────────────────────────────────────────────────────*/
const NOTE = {
  CREATE: (studyRoomId: number) => `/study-rooms/${studyRoomId}/note/new`,
  EDIT: (studyRoomId: number, noteId: number) =>
    `/study-rooms/${studyRoomId}/note/${noteId}/edit`,
  DETAIL: (studyRoomId: number, noteId: number) =>
    `/study-rooms/${studyRoomId}/note/${noteId}`,
  LIST: (id: number) => `/study-rooms/${id}/note`,
} as const;

/* ─────────────────────────────────────────────────────
 * HOMEWORK
 * ────────────────────────────────────────────────────*/
const HOMEWORK = {
  CREATE: (studyRoomId: number) => `/study-rooms/${studyRoomId}/homework/new`,
  DETAIL: (studyRoomId: number, homeworkId: number) =>
    `/study-rooms/${studyRoomId}/homework/${homeworkId}`,
  LIST: (id: number) => `/study-rooms/${id}/homework`,
} as const;

/* ─────────────────────────────────────────────────────
 * PROFILE
 * ────────────────────────────────────────────────────*/
const PROFILE = {
  DETAIL: (userId: number) => `/profile/${userId}`,
} as const;

/* ─────────────────────────────────────────────────────
 * MYPAGE
 * ────────────────────────────────────────────────────*/
const MYPAGE = '/mypage';

/* ─────────────────────────────────────────────────────
 * COMMUNITY
 * ────────────────────────────────────────────────────*/
const PUBLIC_COMMUNITY = {
  COLUMN: {
    LIST: '/community/column',
    DETAIL: (id: number) => `/community/column/${id}`,
  },
} as const;

const PRIVATE_COMMUNITY = {
  COLUMN: {
    CREATE: '/community/column/new',
    EDIT: (id: number) => `/community/column/${id}/edit`,
  },
} as const;

/* ─────────────────────────────────────────────────────
 * ADMIN
 * ────────────────────────────────────────────────────*/
const ADMIN = {
  COLUMN: {
    LIST: '/admin/columns',
    DETAIL: (id: number) => `/admin/columns/${id}`,
  },
} as const;

/* ─────────────────────────────────────────────────────
 * Export - PUBLIC
 * ────────────────────────────────────────────────────*/
export const PUBLIC = {
  CORE,
  PROFILE,
  COMMUNITY: PUBLIC_COMMUNITY,
} as const;

/* ─────────────────────────────────────────────────────
 * Export - PRIVATE
 * ────────────────────────────────────────────────────*/
export const PRIVATE = {
  DASHBOARD,
  ROOM,
  NOTE,
  HOMEWORK,
  QUESTIONS,
  COMMUNITY: PRIVATE_COMMUNITY,
  MYPAGE,
  ADMIN,
} as const;
