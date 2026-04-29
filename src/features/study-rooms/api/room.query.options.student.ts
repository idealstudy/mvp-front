import {
  StudentStudyRoomRequests,
  StudyRoomsQueryKey,
} from '@/features/study-rooms/api';
import { BaseQueryOptions, queryConfig } from '@/shared/lib/query';
import { queryOptions } from '@tanstack/react-query';

import type { StudentStudyRoom, StudyRoomDetail } from '../model/types';

export type StudentStudyRoomQueryOptions = ReturnType<
  typeof createStudentStudyRoomQueryOptions
>;

export const createStudentStudyRoomQueryOptions = (
  api: StudentStudyRoomRequests,
  qOpt: BaseQueryOptions = {}
) => {
  const opt = { ...queryConfig.DEFAULT_QUERY_OPTION, ...qOpt };

  // 스터디룸 목록 조회
  const studentList = () =>
    queryOptions<StudentStudyRoom[]>({
      queryKey: StudyRoomsQueryKey.studentList,
      queryFn: () => api.getStudyRooms(),
      ...opt,
    });

  // 스터디룸 상세 조회
  const studentDetail = (studyRoomId: number) =>
    queryOptions<StudyRoomDetail>({
      queryKey: StudyRoomsQueryKey.studentDetail(studyRoomId),
      queryFn: () => api.getStudyRoomDetail(studyRoomId),
      ...opt,
    });

  return { studentList, studentDetail };
};
