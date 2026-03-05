import { domain } from '@/entities/teacher/core';
import {
  DashboardHomeworkSortKey,
  DashboardMemberSortKey,
  DashboardQnASortKey,
  DashboardTeachingNotesSortKey,
  FrontendTeacherBasicInfo,
  TeacherBasicInfoDTO,
  UpdateTeacherBasicInfoPayload,
} from '@/entities/teacher/types';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';
import { CommonResponse } from '@/types';

import { dto, payload } from './teacher.dto';

/**
 * isProfilePublic -> 한글 변환 헬퍼
 */
const getProfilePublicKorean = (isPublic: boolean): '공개' | '비공개' =>
  isPublic ? '공개' : '비공개';

/**
 * DTO를 Domain 객체로 변환
 */
const transformBasicInfoToFrontend = (
  basicInfoDto: TeacherBasicInfoDTO
): FrontendTeacherBasicInfo =>
  domain.basicInfo.parse({
    name: basicInfoDto.name,
    email: basicInfoDto.email,
    isProfilePublic: basicInfoDto.isProfilePublic,
    simpleIntroduction: basicInfoDto.simpleIntroduction,
    role: 'ROLE_TEACHER' as const,
    profilePublicKorean: getProfilePublicKorean(basicInfoDto.isProfilePublic),
  });

/* ─────────────────────────────────────────────────────
 * [Read] 선생님 기본 정보 조회
 * ────────────────────────────────────────────────────*/
const getBasicInfo = async (): Promise<FrontendTeacherBasicInfo> => {
  const response = await api.private.get<CommonResponse<TeacherBasicInfoDTO>>(
    '/teacher/me/basic-info'
  );

  const basicInfoDto = unwrapEnvelope(response, dto.basicInfo);

  return transformBasicInfoToFrontend(basicInfoDto);
};

/* ─────────────────────────────────────────────────────
 * [Update] 선생님 기본 정보 변경
 * ────────────────────────────────────────────────────*/
const updateBasicInfo = async (
  basicInfo: UpdateTeacherBasicInfoPayload
): Promise<void> => {
  const validated = payload.updateBasicInfo.parse(basicInfo);
  await api.private.patch('/teacher/me/basic-info', validated);
};

/* ─────────────────────────────────────────────────────
 * 선생님 통계 조회
 * ────────────────────────────────────────────────────*/
const getTeacherReport = async () => {
  const response = await api.private.get(`/teacher/me/report`);
  return unwrapEnvelope(response, dto.teacherReport);
};

/* ─────────────────────────────────────────────────────
 * 선생님 수업 노트 전체 목록 조회
 * ────────────────────────────────────────────────────*/
const getTeacherNoteList = async () => {
  const response = await api.private.get(`/teacher/me/teaching-notes`);
  return unwrapEnvelope(response, dto.teacherNoteList);
};

/* ─────────────────────────────────────────────────────
 * 선생님 스터디룸 전체 목록 조회
 * ────────────────────────────────────────────────────*/
const getTeacherStudyRoomList = async () => {
  const response = await api.private.get(`/teacher/me/study-rooms`);
  return unwrapEnvelope(response, dto.teacherStudyRoomList);
};

/* ─────────────────────────────────────────────────────
 * 선생님 대시보드 활동 통계 조회 DTO
 * ────────────────────────────────────────────────────*/
const getTeacherDashboardReport = async () => {
  const response = await api.private.get(`/teacher/dashboard/report`);
  return unwrapEnvelope(response, dto.dashboard.report);
};

/* ─────────────────────────────────────────────────────
 * 선생님 대시보드 수업 노트 전체 목록 조회 DTO
 * ────────────────────────────────────────────────────*/
const getTeacherDashboardNoteList = async ({
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
  const response = await api.private.get(`/teacher/dashboard/teaching-notes`, {
    params,
  });
  return unwrapEnvelope(response, dto.dashboard.noteList);
};

/* ─────────────────────────────────────────────────────
 * 선생님 대시보드 스터디룸 목록 조회
 * ────────────────────────────────────────────────────*/
const getTeacherDashboardStudyRoomList = async () => {
  const response = await api.private.get(`/teacher/dashboard/study-rooms`);
  return unwrapEnvelope(response, dto.dashboard.studyRoomList);
};

/* ─────────────────────────────────────────────────────
 * 선생님 대시보드 답변 하지 않은 질문 목록 조회
 * ────────────────────────────────────────────────────*/
const getTeacherDashboardQnaList = async ({
  page,
  size,
  sortKey,
}: {
  page: number;
  size: number;
  sortKey: DashboardQnASortKey;
}) => {
  const params = { page, size, sortKey };
  const response = await api.private.get(`/teacher/dashboard/qna`, {
    params,
  });
  return unwrapEnvelope(response, dto.dashboard.QnaList);
};

/* ─────────────────────────────────────────────────────
 * 선생님 대시보드 멤버 목록 조회
 * ────────────────────────────────────────────────────*/
const getTeacherDashboardMemberList = async ({
  studyRoomId,
  page,
  size,
  sortKey,
}: {
  studyRoomId?: number;
  page: number;
  size: number;
  sortKey: DashboardMemberSortKey;
}) => {
  const params = { studyRoomId, page, size, sortKey };
  const response = await api.private.get(`/teacher/dashboard/members`, {
    params,
  });
  return unwrapEnvelope(response, dto.dashboard.memberList);
};

/* ─────────────────────────────────────────────────────
 * 선생님 대시보드 과제 목록 조회
 * ────────────────────────────────────────────────────*/
const getTeacherDashboardHomeworkList = async ({
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
  const response = await api.private.get(`/teacher/dashboard/homeworks`, {
    params,
  });
  return unwrapEnvelope(response, dto.dashboard.homeworkList);
};

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const repository = {
  basicInfo: {
    getBasicInfo,
    updateBasicInfo,
  },
  getTeacherNoteList,
  getTeacherStudyRoomList,
  getTeacherReport,
  dashboard: {
    getReport: getTeacherDashboardReport,
    getNoteList: getTeacherDashboardNoteList,
    getStudyRoomList: getTeacherDashboardStudyRoomList,
    getQnaList: getTeacherDashboardQnaList,
    getMemberList: getTeacherDashboardMemberList,
    getHomeworkList: getTeacherDashboardHomeworkList,
  },
};
