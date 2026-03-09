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
 * PUBLIC
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
 * Export - PUBLIC
 * ────────────────────────────────────────────────────*/
export const PUBLIC = {
  CORE,
  PROFILE,
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
} as const;
