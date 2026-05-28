import { parentKeys, repository as parentRepository } from '@/entities/parent';
import { useQuery } from '@tanstack/react-query';

const parentDashboardQuerySettings = {
  staleTime: 1000 * 60 * 5,
  retry: 3,
};

export const useParentDashboardReportQuery = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: parentKeys.dashboard.report(),
    queryFn: () => parentRepository.dashboard.getReport(),
    ...parentDashboardQuerySettings,
    enabled: options?.enabled ?? true,
  });
};

export const useParentDashboardConnectedStudentQuery = () => {
  return useQuery({
    queryKey: parentKeys.dashboard.connectedStudentList(),
    queryFn: () => parentRepository.dashboard.getConnectedStudentList(),
    ...parentDashboardQuerySettings,
  });
};

export const useParentDashboardStudyNewsQuery = (
  studentId: number | null,
  params?: { page?: number; size?: number },
  options?: { enabled?: boolean }
) => {
  const hasValidStudentId =
    typeof studentId === 'number' &&
    Number.isInteger(studentId) &&
    studentId > 0;

  return useQuery({
    queryKey: parentKeys.dashboard.studyNewsList(studentId, params),
    queryFn: () =>
      parentRepository.dashboard.getStudyNewsList(studentId as number, params),
    ...parentDashboardQuerySettings,
    enabled: (options?.enabled ?? true) && hasValidStudentId,
  });
};

export const useParentDashboardStudyConsultationQuery = (
  studentId: number | null,
  studyRoomId: number | null,
  params?: { page?: number; size?: number },
  options?: { enabled?: boolean }
) => {
  const hasValidStudentId =
    typeof studentId === 'number' &&
    Number.isInteger(studentId) &&
    studentId > 0;
  const hasValidStudyRoomId =
    typeof studyRoomId === 'number' &&
    Number.isInteger(studyRoomId) &&
    studyRoomId > 0;

  return useQuery({
    queryKey: parentKeys.dashboard.studyConsultationList(
      studentId,
      studyRoomId,
      params
    ),
    queryFn: () =>
      parentRepository.dashboard.getStudyConsultationList(
        studentId as number,
        studyRoomId as number,
        params
      ),
    ...parentDashboardQuerySettings,
    enabled:
      (options?.enabled ?? true) && hasValidStudentId && hasValidStudyRoomId,
  });
};

export const useParentDashboardInquiryListQuery = () => {
  return useQuery({
    queryKey: parentKeys.dashboard.inquiryList(),
    queryFn: () => parentRepository.dashboard.getInquiryList(),
    ...parentDashboardQuerySettings,
  });
};
