/* ─────────────────────────────────────────────────────
 * CORE ROUTES
 * ────────────────────────────────────────────────────*/
const CORE = {
  INDEX: '/',
  LOGIN: '/login',
  SIGNUP: '/register',
  BIZ: '#',
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
  DETAIL: (id: number) => `/study-room/${id}/note`,
  CREATE: '/study-room/new',
} as const;

/* ─────────────────────────────────────────────────────
 * QUESTIONS
 * ────────────────────────────────────────────────────*/
const QUESTIONS = {
  DETAIL: (studyroomId: number, contextId: number) =>
    `/study-room/${studyroomId}/qna/${contextId}`,
  CREATE: (studyroomId: number) => `/study-room/${studyroomId}/qna/new`,
} as const;

/* ─────────────────────────────────────────────────────
 * STUDY NOTE
 * ────────────────────────────────────────────────────*/
const NOTE = {
  CREATE: '/study-note/new',
  DETAIL: (id: number) => `/study-note/${id}`,
  LIST: (id: number) => `/study-rooms/${id}/note`,
} as const;

/* ─────────────────────────────────────────────────────
 * Export - PUBLIC
 * ────────────────────────────────────────────────────*/
export const PUBLIC = {
  CORE,
} as const;

/* ─────────────────────────────────────────────────────
 * Export - PRIVATE
 * ────────────────────────────────────────────────────*/
export const PRIVATE = {
  DASHBOARD,
  ROOM,
  NOTE,
  QUESTIONS,
} as const;
