import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import { domain } from '../core';
import type {
  HomeworkPageable,
  PageableResponse,
  StudentHomeworkDetailData,
  StudentHomeworkItem,
  TeacherHomeworkDetailData,
  TeacherHomeworkItem,
  TeacherHomeworkRequest,
} from '../types';
import { dto, payload } from './homework.dto';

/* ─────────────────────────────────────────────────────
 * [Teacher] 과제 목록 조회
 * ────────────────────────────────────────────────────*/
const getTeacherHomeworkList = async (
  studyRoomId: number,
  query: HomeworkPageable
): Promise<PageableResponse<TeacherHomeworkItem>> => {
  const validatedQuery = payload.listQuery.parse(query);
  const response = await api.private.get(
    `/teacher/study-rooms/${studyRoomId}/homeworks`,
    {
      params: validatedQuery,
    }
  );

  return unwrapEnvelope(response, dto.teacher.listPage);
};

/* ─────────────────────────────────────────────────────
 * [Teacher] 과제 상세 조회
 * ────────────────────────────────────────────────────*/
const getTeacherHomeworkDetail = async (
  studyRoomId: number,
  homeworkId: number
): Promise<TeacherHomeworkDetailData> => {
  const response = await api.private.get(
    `/teacher/study-rooms/${studyRoomId}/homeworks/${homeworkId}`
  );

  return domain.teacher.detail.parse(
    unwrapEnvelope(response, dto.teacher.detail)
  );
};

/* ─────────────────────────────────────────────────────
 * [Teacher] 과제 생성/수정/삭제
 * ────────────────────────────────────────────────────*/
const createTeacherHomework = async (
  studyRoomId: number,
  body: TeacherHomeworkRequest
): Promise<void> => {
  const validatedBody = payload.teacherCuRequest.parse(body);
  await api.private.post(
    `/teacher/study-rooms/${studyRoomId}/homeworks`,
    validatedBody
  );
};

const updateTeacherHomework = async (
  studyRoomId: number,
  homeworkId: number,
  body: TeacherHomeworkRequest
): Promise<void> => {
  const validatedBody = payload.teacherCuRequest.parse(body);
  await api.private.patch(
    `/teacher/study-rooms/${studyRoomId}/homeworks/${homeworkId}`,
    validatedBody
  );
};

const deleteTeacherHomework = async (
  studyRoomId: number,
  homeworkId: number
): Promise<void> => {
  await api.private.delete(
    `/teacher/study-rooms/${studyRoomId}/homeworks/${homeworkId}`
  );
};

/* ─────────────────────────────────────────────────────
 * [Teacher] 과제 피드백 생성/수정/삭제
 * ────────────────────────────────────────────────────*/
const createTeacherHomeworkFeedback = async (
  studyRoomId: number,
  homeworkStudentId: number,
  body: { content: string }
): Promise<void> => {
  const validatedBody = payload.contentRequest.parse(body);
  await api.private.post(
    `/teacher/study-rooms/${studyRoomId}/homework-students/${homeworkStudentId}/feedback`,
    validatedBody
  );
};

const updateTeacherHomeworkFeedback = async (
  studyRoomId: number,
  homeworkStudentId: number,
  body: { content: string }
): Promise<void> => {
  const validatedBody = payload.contentRequest.parse(body);
  await api.private.patch(
    `/teacher/study-rooms/${studyRoomId}/homework-students/${homeworkStudentId}/feedback`,
    validatedBody
  );
};

const deleteTeacherHomeworkFeedback = async (
  studyRoomId: number,
  homeworkStudentId: number
): Promise<void> => {
  await api.private.delete(
    `/teacher/study-rooms/${studyRoomId}/homework-students/${homeworkStudentId}/feedback`
  );
};

/* ─────────────────────────────────────────────────────
 * [Student] 과제 목록/상세 조회
 * ────────────────────────────────────────────────────*/
const getStudentHomeworkList = async (
  studyRoomId: number,
  query: HomeworkPageable
): Promise<PageableResponse<StudentHomeworkItem>> => {
  const validatedQuery = payload.listQuery.parse(query);
  const response = await api.private.get(
    `/student/study-rooms/${studyRoomId}/homeworks`,
    {
      params: validatedQuery,
    }
  );

  return unwrapEnvelope(response, dto.student.listPage);
};

const getStudentHomeworkDetail = async (
  studyRoomId: number,
  homeworkId: number
): Promise<StudentHomeworkDetailData> => {
  const response = await api.private.get(
    `/student/study-rooms/${studyRoomId}/homeworks/${homeworkId}`
  );

  return domain.student.detail.parse(
    unwrapEnvelope(response, dto.student.detail)
  );
};

/* ─────────────────────────────────────────────────────
 * [Student] 과제 제출 생성/수정/삭제
 * ────────────────────────────────────────────────────*/
const createStudentHomeworkSubmission = async (
  studyRoomId: number,
  homeworkId: number,
  body: { content: string }
): Promise<void> => {
  const validatedBody = payload.contentRequest.parse(body);
  await api.private.post(
    `/student/study-rooms/${studyRoomId}/homeworks/${homeworkId}/homework-students`,
    validatedBody
  );
};

const updateStudentHomeworkSubmission = async (
  studyRoomId: number,
  homeworkStudentId: number,
  body: { content: string }
): Promise<void> => {
  const validatedBody = payload.contentRequest.parse(body);
  await api.private.patch(
    `/student/study-rooms/${studyRoomId}/homework-students/${homeworkStudentId}`,
    validatedBody
  );
};

const deleteStudentHomeworkSubmission = async (
  studyRoomId: number,
  homeworkStudentId: number
): Promise<void> => {
  await api.private.delete(
    `/student/study-rooms/${studyRoomId}/homework-students/${homeworkStudentId}`
  );
};

export const repository = {
  teacher: {
    getList: getTeacherHomeworkList,
    getDetail: getTeacherHomeworkDetail,
    create: createTeacherHomework,
    update: updateTeacherHomework,
    delete: deleteTeacherHomework,
    feedback: {
      create: createTeacherHomeworkFeedback,
      update: updateTeacherHomeworkFeedback,
      delete: deleteTeacherHomeworkFeedback,
    },
  },
  student: {
    getList: getStudentHomeworkList,
    getDetail: getStudentHomeworkDetail,
    submit: createStudentHomeworkSubmission,
    updateSubmission: updateStudentHomeworkSubmission,
    deleteSubmission: deleteStudentHomeworkSubmission,
  },
};
