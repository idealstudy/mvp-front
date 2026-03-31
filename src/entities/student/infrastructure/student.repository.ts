import { domain } from '@/entities/student/core';
import {
  FrontendStudentBasicInfo,
  HomeworkListQuery,
  QnaListQuery,
  StudentBasicInfoDTO,
  TeachingNoteListQuery,
  UpdateStudentBasicInfoPayload,
} from '@/entities/student/types';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';
import { CommonResponse } from '@/types';

import {
  DashboardHomeworkSortKey,
  DashboardQnASortKey,
  DashboardTeachingNotesSortKey,
} from '../types';
import { dto, payload, query } from './student.dto';

/* ─────────────────────────────────────────────────────
 * [Read] 마이페이지 - 학생 기본 정보 조회
 * ────────────────────────────────────────────────────*/
const getProfilePublicKorean = (isPublic: boolean): '공개' | '비공개' =>
  isPublic ? '공개' : '비공개';

// DTO를 Domain 객체로 변환
const transformBasicInfoToFrontend = (
  basicInfoDto: StudentBasicInfoDTO
): FrontendStudentBasicInfo =>
  domain.profile.basicInfo.parse({
    name: basicInfoDto.name,
    email: basicInfoDto.email,
    isProfilePublic: basicInfoDto.isProfilePublic,
    learningGoal: basicInfoDto.learningGoal,
    role: 'ROLE_STUDENT' as const,
    profilePublicKorean: getProfilePublicKorean(basicInfoDto.isProfilePublic),
  });

const getBasicInfo = async (): Promise<FrontendStudentBasicInfo> => {
  const response = await api.private.get<CommonResponse<StudentBasicInfoDTO>>(
    '/student/me/basic-info'
  );

  const basicInfoDto = unwrapEnvelope(response, dto.profile.basicInfo);

  return transformBasicInfoToFrontend(basicInfoDto);
};

/* ─────────────────────────────────────────────────────
 * [Update] 마이페이지 - 학생 기본 정보 변경
 * ────────────────────────────────────────────────────*/
const updateBasicInfo = async (
  basicInfo: UpdateStudentBasicInfoPayload
): Promise<void> => {
  const validated = payload.updateBasicInfo.parse(basicInfo);
  await api.private.patch('/student/me/basic-info', validated);
};

/* ─────────────────────────────────────────────────────
 * [Read] 마이페이지 - 학생 통계 조회
 * ────────────────────────────────────────────────────*/
const getMypageStudentReport = async () => {
  const response = await api.private.get(`/student/me/report`);
  return unwrapEnvelope(response, dto.profile.report);
};

/* ─────────────────────────────────────────────────────
 * [Read] 마이페이지 - 학생 숙제 조회
 * ────────────────────────────────────────────────────*/
const getMypageStudentHomeworkList = async (params: HomeworkListQuery) => {
  const validated = query.profile.homeworkList.parse(params);
  const response = await api.private.get(`/student/me/homeworks`, {
    params: validated,
  });
  return unwrapEnvelope(response, dto.profile.homeworkList);
};

/* ─────────────────────────────────────────────────────
 * [Read] 마이페이지 - 학생 질문 조회
 * ────────────────────────────────────────────────────*/
const getMypageStudentQnaList = async (params: QnaListQuery) => {
  const validated = query.profile.qnaList.parse(params);
  const response = await api.private.get(`/student/me/qna`, {
    params: validated,
  });
  return unwrapEnvelope(response, dto.profile.qnaList);
};

/* ─────────────────────────────────────────────────────
 * [Read] 마이페이지 - 학생 수업노트 조회
 * ────────────────────────────────────────────────────*/
const getMypageStudentTeachingNoteList = async (
  params: TeachingNoteListQuery
) => {
  const validated = query.profile.teachingNoteList.parse(params);
  const response = await api.private.get(`/student/me/teaching-notes`, {
    params: validated,
  });
  return unwrapEnvelope(response, dto.profile.teachingNoteList);
};

/* ─────────────────────────────────────────────────────
 * [Read] 마이페이지 - 학생 참여 스터디룸 조회
 * ────────────────────────────────────────────────────*/
const getMypageStudentStudyRoomList = async () => {
  const response = await api.private.get(`/student/me/study-rooms`);
  return unwrapEnvelope(response, dto.profile.studyRoomList);
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
  return unwrapEnvelope(response, dto.dashboard.qnaList);
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

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const repository = {
  mypage: {
    basicInfo: {
      getBasicInfo,
      updateBasicInfo,
    },
    getReport: getMypageStudentReport,
    getHomeworkList: getMypageStudentHomeworkList,
    getQnaList: getMypageStudentQnaList,
    getTeachingNoteList: getMypageStudentTeachingNoteList,
    getStudyRoomList: getMypageStudentStudyRoomList,
  },
  dashboard: {
    getReport: getStudentDashboardReport,
    getNoteList: getStudentDashboardNoteList,
    getStudyRoomList: getStudentDashboardStudyRoomList,
    getQnaList: getStudentDashboardQnaList,
    getHomeworkList: getStudentDashboardHomeworkList,
  },
};
