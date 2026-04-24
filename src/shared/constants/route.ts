/* ─────────────────────────────────────────────────────
 * CORE ROUTES
 * ────────────────────────────────────────────────────*/
const CORE = {
  INDEX: '/',
  LOGIN: '/login',
  SIGNUP: '/register',
  LIST: {
    BASE: '/list',
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
} as const;

/* ─────────────────────────────────────────────────────
 * SETTINGS
 * ────────────────────────────────────────────────────*/
const SETTINGS = '/settings';

/* ─────────────────────────────────────────────────────
 * STUDY ROOM
 * ────────────────────────────────────────────────────*/
const ROOM = {
  DETAIL: (id: number) => `/study-rooms/${id}/note`,
  CREATE: '/study-rooms/new',
  EDIT: (id: number) => `/study-rooms/${id}/edit`,
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
 * STUDENT STUDY NOTE
 * ────────────────────────────────────────────────────*/
const STUDENT_NOTE = {
  CREATE: '/study-note/new',
  DETAIL: (noteId: number) => `/study-note/${noteId}`,
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
  TEACHER: (teacherId: number) => `/profile/teacher/${teacherId}`,
  STUDENT: (studentId: number) => `/profile/student/${studentId}`,
} as const;

/* ─────────────────────────────────────────────────────
 * STUDY_ROOM_PREVIEW
 * ────────────────────────────────────────────────────*/
const STUDY_ROOM_PREVIEW = {
  DETAIL: (studyRoomId: number, teacherId: number) =>
    `/study-room-preview/${studyRoomId}/${teacherId}`,
} as const;

/* ─────────────────────────────────────────────────────
 * MYPAGE
 * ────────────────────────────────────────────────────*/
const MYPAGE = '/mypage';

/* ─────────────────────────────────────────────────────
 * COMMUNITY
 * ────────────────────────────────────────────────────*/
const PUBLIC_COMMUNITY = {
  BASE: '/community',
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
 * INQUIRY
 * ────────────────────────────────────────────────────*/
const INQUIRY = {
  DETAIL: (id: number) => `/inquiry/${id}`,
  CREATE: (teacherId: number, studyRoomId?: number) =>
    `/inquiry/new?teacherId=${teacherId}${
      studyRoomId ? `&studyRoomId=${studyRoomId}` : ''
    }`,
} as const;

/* ─────────────────────────────────────────────────────
 * ADMIN
 * ────────────────────────────────────────────────────*/
const ADMIN = {
  COLUMN: {
    LIST: '/admin/column',
    DETAIL: (id: number) => `/admin/column/${id}`,
  },
} as const;

/* ─────────────────────────────────────────────────────
 * Export - PUBLIC
 * ────────────────────────────────────────────────────*/
export const PUBLIC = {
  CORE,
  PROFILE,
  STUDY_ROOM_PREVIEW,
  COMMUNITY: PUBLIC_COMMUNITY,
  INQUIRY,
} as const;

/* ─────────────────────────────────────────────────────
 * Export - PRIVATE
 * ────────────────────────────────────────────────────*/
export const PRIVATE = {
  DASHBOARD,
  ROOM,
  NOTE,
  STUDENT_NOTE,
  HOMEWORK,
  QUESTIONS,
  COMMUNITY: PRIVATE_COMMUNITY,
  MYPAGE,
  ADMIN,
  SETTINGS,
} as const;
