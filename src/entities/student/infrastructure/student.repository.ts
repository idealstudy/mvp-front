import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import {
  DashboardHomeworkSortKey,
  DashboardQnASortKey,
  DashboardTeachingNotesSortKey,
} from '../types';
import { dto } from './student.dto';

/* ─────────────────────────────────────────────────────
 * 학생 통계 조회
 * ────────────────────────────────────────────────────*/
const getStudentReport = async () => {
  const response = await api.private.get(`/student/me/report`);
  return unwrapEnvelope(response, dto.studentReport);
};

/* ─────────────────────────────────────────────────────
 * 학생 대시보드 활동 통계 조회
 * ────────────────────────────────────────────────────*/
const getStudentDashboardReport = async () => {
  const response = await api.private.get(`/student/dashboard/report`);
  return unwrapEnvelope(response, dto.dashboard.report);
};

/* ─────────────────────────────────────────────────────
 * 학생 대시보드 수업 노트 전체 목록 조회 DTO
 * ────────────────────────────────────────────────────*/
const getStudentDashboardNoteList = async ({
  studyRoomId,
  page,
  size,
  sortKey,
}: {
  studyRoomId?: number;
  page: number;
  size: number;
  sortKey: DashboardTeachingNotesSortKey;
}) => {
  const params = studyRoomId
    ? { studyRoomId, page, size, sortKey }
    : { page, size, sortKey };
  const response = await api.private.get(`/student/dashboard/teaching-notes`, {
    params,
  });
  return unwrapEnvelope(response, dto.dashboard.noteList);
};

/* ─────────────────────────────────────────────────────
 * 학생 대시보드 스터디룸 전체 목록 조회 DTO
 * ────────────────────────────────────────────────────*/
const getStudentDashboardStudyRoomList = async () => {
  const response = await api.private.get(`/student/dashboard/study-rooms`);
  return unwrapEnvelope(response, dto.dashboard.studyRoomList);
};

/* ─────────────────────────────────────────────────────
 * 학생 대시보드 답변 받은 질문 목록 조회 DTO
 * ────────────────────────────────────────────────────*/
const getStudentDashboardQnaList = async ({
  page,
  size,
  sortKey,
}: {
  page: number;
  size: number;
  sortKey: DashboardQnASortKey;
}) => {
  const params = { page, size, sortKey };
  const response = await api.private.get(`/student/dashboard/qna`, {
    params,
  });
  return unwrapEnvelope(response, dto.dashboard.QnaList);
};

/* ─────────────────────────────────────────────────────
 * 학생 대시보드 과제 목록 조회 DTO
 * ────────────────────────────────────────────────────*/
const getStudentDashboardHomeworkList = async ({
  studyRoomId,
  page,
  size,
  sortKey,
}: {
  studyRoomId?: number;
  page: number;
  size: number;
  sortKey: DashboardHomeworkSortKey;
}) => {
  const params = studyRoomId
    ? { studyRoomId, page, size, sortKey }
    : { page, size, sortKey };
  const response = await api.private.get(`/student/dashboard/homeworks`, {
    params,
  });
  return unwrapEnvelope(response, dto.dashboard.homeworkList);
};

export const studentRepository = {
  getStudentReport,
  dashboard: {
    getReport: getStudentDashboardReport,
    getNoteList: getStudentDashboardNoteList,
    getStudyRoomList: getStudentDashboardStudyRoomList,
    getQnaList: getStudentDashboardQnaList,
    getHomeworkList: getStudentDashboardHomeworkList,
  },
};
