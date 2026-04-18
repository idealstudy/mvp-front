import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import type {
  StudentNoteDailyDTO,
  StudentNoteDailyQuery,
  StudentNoteDetail,
  StudentNoteListResponse,
  StudentNoteMonthlyDTO,
  StudentNoteMonthlyQuery,
  StudentNoteTimerProgress,
  StudentNoteTimerStartResponse,
  StudentNoteWritePayload,
} from '../types';
import { studentNoteDto, studentNotePayload } from './student-note.dto';

/* ─────────────────────────────────────────────────────
 * Timer
 * ────────────────────────────────────────────────────*/
const getTimerProgress = async (): Promise<StudentNoteTimerProgress | null> => {
  const response = await api.private.get('/student/study-note/timer/progress');
  return unwrapEnvelope(response, studentNoteDto.timer.progress);
};

const startTimer = async (
  body: StudentNoteWritePayload
): Promise<StudentNoteTimerStartResponse> => {
  const validatedBody = studentNotePayload.write.parse(body);
  const response = await api.private.post(
    '/student/study-note/timer/start',
    validatedBody
  );
  return unwrapEnvelope(response, studentNoteDto.timer.startResponse);
};

const finishTimer = async (
  studyNoteId: number,
  body: StudentNoteWritePayload
): Promise<void> => {
  const validatedBody = studentNotePayload.write.parse(body);
  await api.private.post(
    `/student/study-note/timer/finish/${studyNoteId}`,
    validatedBody
  );
};

const pauseTimer = async (
  studyNoteId: number,
  body: StudentNoteWritePayload
): Promise<void> => {
  const validatedBody = studentNotePayload.write.parse(body);
  await api.private.post(
    `/student/study-note/timer/pause/${studyNoteId}`,
    validatedBody
  );
};

const resumeTimer = async (studyNoteId: number): Promise<void> => {
  await api.private.post(`/student/study-note/timer/resume/${studyNoteId}`);
};

const resetTimer = async (studyNoteId: number): Promise<void> => {
  await api.private.post(`/student/study-note/timer/reset/${studyNoteId}`);
};

const tempSaveTimer = async (
  studyNoteId: number,
  body: StudentNoteWritePayload
): Promise<void> => {
  const validatedBody = studentNotePayload.write.parse(body);
  await api.private.post(
    `/student/study-note/temp/${studyNoteId}`,
    validatedBody
  );
};

/* ─────────────────────────────────────────────────────
 * Calendar
 * ────────────────────────────────────────────────────*/
const getMonthly = async (
  studentId: number,
  query: StudentNoteMonthlyQuery
): Promise<StudentNoteMonthlyDTO> => {
  const validatedQuery = studentNotePayload.monthlyQuery.parse(query);
  const response = await api.private.get(
    `/common/study-note/month/${studentId}`,
    { params: validatedQuery }
  );
  return unwrapEnvelope(response, studentNoteDto.calendar.monthlyResponse);
};

const getDaily = async (
  query: StudentNoteDailyQuery
): Promise<StudentNoteDailyDTO> => {
  const validatedQuery = studentNotePayload.dailyQuery.parse(query);
  const response = await api.private.get('/common/study-note/daily', {
    params: validatedQuery,
  });
  return unwrapEnvelope(response, studentNoteDto.calendar.dailyResponse);
};

/* ─────────────────────────────────────────────────────
 * CRUD
 * ────────────────────────────────────────────────────*/
const createNote = async (body: StudentNoteWritePayload): Promise<void> => {
  const validatedBody = studentNotePayload.write.parse(body);
  await api.private.post('/student/study-note', validatedBody);
};

const getNoteList = async (
  page: number,
  size = 6
): Promise<StudentNoteListResponse> => {
  const response = await api.private.get('/common/study-note/list', {
    params: { page, size },
  });
  return unwrapEnvelope(response, studentNoteDto.crud.listResponse);
};

const getNoteDetail = async (
  studyNoteId: number
): Promise<StudentNoteDetail> => {
  const response = await api.private.get(`/common/study-note/${studyNoteId}`);
  return unwrapEnvelope(response, studentNoteDto.crud.detail);
};

const updateNote = async (
  studyNoteId: number,
  body: StudentNoteWritePayload
): Promise<void> => {
  const validatedBody = studentNotePayload.write.parse(body);
  await api.private.put(`/student/study-note/${studyNoteId}`, validatedBody);
};

const deleteNote = async (studyNoteId: number): Promise<void> => {
  await api.private.delete(`/student/study-note/${studyNoteId}`);
};

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const studentNoteRepository = {
  timer: {
    getProgress: getTimerProgress,
    start: startTimer,
    finish: finishTimer,
    pause: pauseTimer,
    resume: resumeTimer,
    reset: resetTimer,
    tempSave: tempSaveTimer,
  },
  calendar: {
    getMonthly,
    getDaily,
  },
  crud: {
    create: createNote,
    getList: getNoteList,
    getDetail: getNoteDetail,
    update: updateNote,
    delete: deleteNote,
  },
};
