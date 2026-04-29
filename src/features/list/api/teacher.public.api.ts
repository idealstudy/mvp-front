import {
  CLASS_FORM_TO_KOREAN,
  ENROLLMENT_STATUS_TO_KOREAN,
  SUBJECT_TO_KOREAN,
} from '@/entities/study-room-preview/core/preview.domain';
import { api } from '@/shared/api';
import type { CommonResponse } from '@/types/http';

import type {
  PublicStudyRoomsResponse,
  PublicTeacherProfile,
  PublicTeachersResponse,
} from '../types/teacher.types';

// 공개 강사 목록 조회
export const getPublicTeachers = async (params?: {
  page?: number;
  size?: number;
  sort?: 'LATEST' | 'OLDEST' | 'ALPHABETICAL';
  isNewTeacher?: boolean; // TBD: 신규 강사 필터링
}): Promise<PublicTeachersResponse> => {
  const requestParams = {
    ...params,
    sort: params?.sort ?? 'LATEST', // 기본값 LATEST
    // TODO: isNewTeacher 필터링 지원 (TBD)
  };

  const response = await api.public.get<CommonResponse<PublicTeachersResponse>>(
    '/public/teachers',
    { params: requestParams }
  );
  return response.data;
};

// 공개 스터디룸 목록 조회
export const getPublicStudyRooms = async (params?: {
  page?: number;
  size?: number;
  sort?: 'LATEST' | 'OLDEST' | 'ALPHABETICAL';
  teacherId?: number; // TBD: 강사별 필터링
  enrollmentStatus?: keyof typeof ENROLLMENT_STATUS_TO_KOREAN;
  classForm?: keyof typeof CLASS_FORM_TO_KOREAN;
  subjectType?: keyof typeof SUBJECT_TO_KOREAN;
}): Promise<PublicStudyRoomsResponse> => {
  const requestParams = {
    ...params,
    sort: params?.sort ?? 'LATEST', // 기본값 LATEST
    // TODO: teacherId 필터링 지원 (TBD)
  };

  const response = await api.public.get<
    CommonResponse<PublicStudyRoomsResponse>
  >('/public/study-rooms', { params: requestParams });
  return response.data;
};

// 강사 공개 프로필 조회 (기존 프로필 API 활용)
export const getTeacherPublicProfile = async (
  teacherId: number
): Promise<PublicTeacherProfile | null> => {
  try {
    // 기존 프로필 API 활용
    // TODO: 응답 데이터를 PublicTeacherProfile 형태로 변환
    // 현재는 프로필 API 응답 구조에 따라 변환 필요
    await api.public.get<CommonResponse<unknown>>(
      `/public/members/profile/${teacherId}`
    );

    return null;
  } catch {
    return null;
  }
};
