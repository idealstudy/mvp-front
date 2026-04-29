import {
  CLASS_FORM_TO_KOREAN,
  ENROLLMENT_STATUS_TO_KOREAN,
  SUBJECT_TO_KOREAN,
} from '@/entities/study-room-preview/core/preview.domain';
import { useQuery } from '@tanstack/react-query';

import {
  getPublicStudyRooms,
  getPublicTeachers,
  getTeacherPublicProfile,
} from './teacher.public.api';

type SortOption = 'LATEST' | 'OLDEST' | 'ALPHABETICAL';
type SortSubjectOption = 'ALL' | 'KOREAN' | 'ENGLISH' | 'MATH' | 'OTHER';

export const TeachersQueryKey = {
  all: ['publicTeachers'] as const,
  list: (params?: {
    page?: number;
    size?: number;
    sort?: SortOption;
    isNewTeacher?: boolean;
  }) => ['publicTeachers', 'list', params] as const,
  detail: (id: number) => ['publicTeachers', 'detail', id] as const,
};

export const StudyRoomsQueryKey = {
  all: ['publicStudyRooms'] as const,
  list: (params?: {
    page?: number;
    size?: number;
    sort?: SortOption;
    enrollmentStatus?: keyof typeof ENROLLMENT_STATUS_TO_KOREAN;
    classForm?: keyof typeof CLASS_FORM_TO_KOREAN;
    subjectType?: keyof typeof SUBJECT_TO_KOREAN;
    teacherId?: number;
  }) => ['publicStudyRooms', 'list', params] as const,
};

export const usePublicTeachersQuery = (params?: {
  page?: number;
  size?: number;
  sort?: SortOption;
  subject?: SortSubjectOption;
  isNewTeacher?: boolean;
}) => {
  return useQuery({
    queryKey: TeachersQueryKey.list(params),
    queryFn: () => getPublicTeachers(params),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

export const usePublicStudyRoomsQuery = (params?: {
  page?: number;
  size?: number;
  sort?: SortOption;
  enrollmentStatus?: keyof typeof ENROLLMENT_STATUS_TO_KOREAN;
  classForm?: keyof typeof CLASS_FORM_TO_KOREAN;
  subjectType?: keyof typeof SUBJECT_TO_KOREAN;
  teacherId?: number;
}) => {
  return useQuery({
    queryKey: StudyRoomsQueryKey.list(params),
    queryFn: () => getPublicStudyRooms(params),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

export const useTeacherPublicProfileQuery = (teacherId: number) => {
  return useQuery({
    queryKey: TeachersQueryKey.detail(teacherId),
    queryFn: () => getTeacherPublicProfile(teacherId),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
  });
};
