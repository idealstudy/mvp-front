import { domain } from '@/entities/parent/core';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';
import { CommonResponse } from '@/types';

import {
  FrontendParentBasicInfo,
  ParentBasicInfoDTO,
  UpdateParentBasicInfoPayload,
} from '../types';
import { dto, payload } from './parent.dto';

/* ─────────────────────────────────────────────────────
 * [Read] 부모님 마이페이지 - 기본 정보 조회
 * ────────────────────────────────────────────────────*/
const getProfilePublicKorean = (isPublic: boolean): '공개' | '비공개' =>
  isPublic ? '공개' : '비공개';

// basicInfo DTO를 Domain 객체로 변환
const transformBasicInfoToFrontend = (
  basicInfoDto: ParentBasicInfoDTO
): FrontendParentBasicInfo =>
  domain.basicInfo.parse({
    name: basicInfoDto.name,
    email: basicInfoDto.email,
    isProfilePublic: basicInfoDto.isProfilePublic,
    role: 'ROLE_PARENT' as const,
    profilePublicKorean: getProfilePublicKorean(basicInfoDto.isProfilePublic),
  });

const getParentMyPageBasicInfo = async (): Promise<FrontendParentBasicInfo> => {
  const response = await api.private.get<CommonResponse<ParentBasicInfoDTO>>(
    `/parent/me/basic-info`
  );

  const basicInfoDto = unwrapEnvelope(response, dto.mypage.basicInfo);

  return transformBasicInfoToFrontend(basicInfoDto);
};

/* ─────────────────────────────────────────────────────
 * [Update] 부모님 마이페이지 - 기본 정보 수정
 * ────────────────────────────────────────────────────*/
const updateParentMyPage = async (
  basicInfo: UpdateParentBasicInfoPayload
): Promise<void> => {
  const validated = payload.updateBasicInfo.parse(basicInfo);
  await api.private.patch(`/parent/me/basic-info`, validated);
};

/* ─────────────────────────────────────────────────────
 * [Read] 부모님 대시보드 - 연결된 학생 별 스터디룸 목록 조회
 * ────────────────────────────────────────────────────*/
const getParentDashboardConnectedStudentList = async () => {
  const response = await api.private.get(`/parent/dashboard/students`);
  return unwrapEnvelope(response, dto.dashboard.connectedStudentList);
};

/* ─────────────────────────────────────────────────────
 * [Read] 부모님 대시보드 - 활동 통계 조회
 * ────────────────────────────────────────────────────*/
const getParentDashboardReport = async () => {
  const response = await api.private.get(`/parent/dashboard/report`);
  return unwrapEnvelope(response, dto.dashboard.report);
};

/* ─────────────────────────────────────────────────────
 * [Read] 부모님 대시보드 - 학습 소식 목록 조회
 * ────────────────────────────────────────────────────*/
const getParentDashboardStudyNewsList = async (
  studentId: number,
  params?: { page?: number; size?: number }
) => {
  const response = await api.private.get(
    `/parent/dashboard/students/${studentId}/study-news`,
    {
      params,
    }
  );
  return unwrapEnvelope(response, dto.dashboard.studyNewsList);
};

/* ─────────────────────────────────────────────────────
 * [Read] 부모님 대시보드 - 학습 일지 목록 조회
 * ────────────────────────────────────────────────────*/
const getParentDashboardStudyConsultationList = async (
  studentId: number,
  studyRoomId: number,
  params?: { page?: number; size?: number }
) => {
  const response = await api.private.get(
    `/parent/dashboard/students/${studentId}/study-rooms/${studyRoomId}/consultation-sheets`,
    { params }
  );
  return unwrapEnvelope(response, dto.dashboard.consultationList);
};

/* ─────────────────────────────────────────────────────
 * TODO: 임시로 /public/study-rooms 갖다쓰기
 * [Read] 부모님 대시보드 - 스터디룸 둘러보기
 * ────────────────────────────────────────────────────*/
// const getParentDashboardStudyRoomPreviewList = async () => {
//   const response = await api.private.get(`/parent/dashboard/study-rooms`);
//   return unwrapEnvelope(response, dto.dashboard.studyRoomPreviewList);
// };

/* ─────────────────────────────────────────────────────
 * [Read] 부모님 대시보드 - 문의 목록 조회
 * ────────────────────────────────────────────────────*/
const getParentDashboardInquiryList = async () => {
  const response = await api.private.get(`/parent/dashboard/inquiries`);
  return unwrapEnvelope(response, dto.dashboard.inquiryList);
};

export const repository = {
  mypage: {
    getBasicInfo: getParentMyPageBasicInfo,
    updateBasicInfo: updateParentMyPage,
  },
  dashboard: {
    getConnectedStudentList: getParentDashboardConnectedStudentList,
    getReport: getParentDashboardReport,
    getStudyNewsList: getParentDashboardStudyNewsList,
    getStudyConsultationList: getParentDashboardStudyConsultationList,
    // getStudyRoomPreviewList: getParentDashboardStudyRoomPreviewList,
    getInquiryList: getParentDashboardInquiryList,
  },
};
