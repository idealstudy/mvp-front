import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import { dto } from './parent.dto';

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
const getParentDashboardStudyNewsList = async (studentId: number) => {
  const response = await api.private.get(
    `/parent/dashboard/students/${studentId}/study-news`
  );
  return unwrapEnvelope(response, dto.dashboard.studyNewsList);
};

/* ─────────────────────────────────────────────────────
 * [Read] 부모님 대시보드 - 학습 일지 목록 조회
 * ────────────────────────────────────────────────────*/
const getParentDashboardStudyConsultationList = async (studyRoomId: number) => {
  const response = await api.private.get(
    `/parent/dashboard/study-rooms/${studyRoomId}/consultation-sheets`
  );
  return unwrapEnvelope(response, dto.dashboard.consultationList);
};

/* ─────────────────────────────────────────────────────
 * [Read] 부모님 대시보드 - 스터디룸 둘러보기
 * ────────────────────────────────────────────────────*/
const getParentDashboardStudyRoomPreviewList = async () => {
  const response = await api.private.get(`/parent/dashboard/study-rooms`);
  return unwrapEnvelope(response, dto.dashboard.studyRoomPreviewList);
};

/* ─────────────────────────────────────────────────────
 * [Read] 부모님 대시보드 - 문의 목록 조회
 * ────────────────────────────────────────────────────*/
const getParentDashboardInquiryList = async () => {
  const response = await api.private.get(`/parent/dashboard/inquiries`);
  return unwrapEnvelope(response, dto.dashboard.inquiryList);
};

export const repository = {
  dashboard: {
    getConnectedStudentList: getParentDashboardConnectedStudentList,
    getReport: getParentDashboardReport,
    getStudyNewsList: getParentDashboardStudyNewsList,
    getStudyConsultationList: getParentDashboardStudyConsultationList,
    getStudyRoomPreviewList: getParentDashboardStudyRoomPreviewList,
    getInquiryList: getParentDashboardInquiryList,
  },
};
