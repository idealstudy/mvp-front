import { domain } from '@/entities/teacher/core';
import {
  CareerPayload,
  FrontendTeacherBasicInfo,
  FrontendTeacherCareerList,
  GetTeacherReviewListQuery,
  TeacherBasicInfoDTO,
  TeacherCareerListDTO,
  UpdateTeacherBasicInfoPayload,
  UpdateTeacherTeachingNoteRepresentativePayload,
} from '@/entities/teacher/types';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';
import { CommonResponse } from '@/types';

import { dto, payload, query } from './teacher.dto';

// 날짜 형식 변환
const toDateString = (iso: string) => iso?.split('T')[0] || '';

/* ─────────────────────────────────────────────────────
 * [Read] 선생님 기본 정보 조회
 * ────────────────────────────────────────────────────*/
const getProfilePublicKorean = (isPublic: boolean): '공개' | '비공개' =>
  isPublic ? '공개' : '비공개';

// basicInfo DTO를 Domain 객체로 변환
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
  const validated = payload.basicInfo.parse(basicInfo);
  await api.private.patch('/teacher/me/basic-info', validated);
};

/* ─────────────────────────────────────────────────────
 * [Read] 선생님 통계 조회
 * ────────────────────────────────────────────────────*/
const getTeacherReport = async () => {
  const response = await api.private.get(`/teacher/me/report`);
  return unwrapEnvelope(response, dto.teacherReport);
};

/* ─────────────────────────────────────────────────────
 * [Read] 선생님 수업 노트 전체 목록 조회
 * ────────────────────────────────────────────────────*/
const getTeacherNoteList = async () => {
  const response = await api.private.get(`/teacher/me/teaching-notes`);
  return unwrapEnvelope(response, dto.teacherNoteList);
};

/* ─────────────────────────────────────────────────────
 * [Update] 선생님 수업 노트 대표 설정/해제
 * ────────────────────────────────────────────────────*/
const setTeacherNoteRepresentative = async (
  teachingNoteId: number,
  data: UpdateTeacherTeachingNoteRepresentativePayload
) => {
  const validated = payload.teachingNoteRepresentative.parse(data);
  await api.private.patch(
    `/teacher/me/teaching-notes/${teachingNoteId}/representative`,
    validated
  );
};

/* ─────────────────────────────────────────────────────
 * [Read] 선생님 스터디룸 전체 목록 조회
 * ────────────────────────────────────────────────────*/
const getTeacherStudyRoomList = async () => {
  const response = await api.private.get(`/teacher/me/study-rooms`);
  return unwrapEnvelope(response, dto.teacherStudyRoomList);
};

/* ─────────────────────────────────────────────────────
 * [Read] 선생님 후기 전체 목록 조회
 * ────────────────────────────────────────────────────*/
const getTeacherReviewList = async (params: GetTeacherReviewListQuery) => {
  const validated = query.teacherReview.parse(params);
  const response = await api.private.get(`/teacher/me/reviews`, {
    params: validated,
  });
  return unwrapEnvelope(response, dto.teacherReviewList);
};

/* ─────────────────────────────────────────────────────
 * [Create] 선생님 경력 생성
 * ────────────────────────────────────────────────────*/
const postTeacherCareer = async (careerData: CareerPayload): Promise<void> => {
  const validated = payload.career.parse(careerData);
  await api.private.post(`/teacher/me/careers`, validated);
};

/* ─────────────────────────────────────────────────────
 * [Read] 선생님 경력 전체 목록 조회
 * ────────────────────────────────────────────────────*/
// careers DTO를 Domain 객체로 변환
const transformCareersToFrontend = (dtos: TeacherCareerListDTO) => {
  return dtos.map((dto) =>
    domain.teacherCareerListItem.parse({
      ...dto,
      startDate: toDateString(dto.startDate),
      endDate: dto.endDate ? toDateString(dto.endDate) : '',
    })
  );
};

const getTeacherCareerList = async (): Promise<FrontendTeacherCareerList> => {
  const response = await api.private.get<CommonResponse<TeacherCareerListDTO>>(
    '/teacher/me/careers'
  );

  const dtos = unwrapEnvelope(response, dto.teacherCareerList);
  return transformCareersToFrontend(dtos);
};

/* ─────────────────────────────────────────────────────
 * [Update] 선생님 경력 변경
 * ────────────────────────────────────────────────────*/
const updateTeacherCareer = async (
  careerId: number,
  careerData: CareerPayload
): Promise<void> => {
  const validated = payload.career.parse(careerData);
  await api.private.put(`/teacher/me/careers/${careerId}`, validated);
};

/* ─────────────────────────────────────────────────────
 * [Delete] 선생님 경력 삭제
 * ────────────────────────────────────────────────────*/
const deleteTeacherCareer = async (careerId: number): Promise<void> => {
  await api.private.delete(`/teacher/me/careers/${careerId}`);
};

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const repository = {
  basicInfo: {
    getBasicInfo,
    updateBasicInfo,
  },
  teachingNote: {
    getTeacherNoteList,
    setTeacherNoteRepresentative,
  },
  getTeacherStudyRoomList,
  getTeacherReport,
  getTeacherReviewList,
  career: {
    postTeacherCareer,
    getTeacherCareerList,
    updateTeacherCareer,
    deleteTeacherCareer,
  },
};
