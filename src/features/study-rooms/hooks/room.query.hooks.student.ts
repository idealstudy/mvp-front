import type { StudentStudyRoomRequests } from '@/features/study-rooms/api/room.api.base';
import { createStudentStudyRoomQueryOptions } from '@/features/study-rooms/api/room.query.options.student';
import { BaseQueryOptions } from '@/shared/lib';
import { useQuery } from '@tanstack/react-query';

export const createStudentStudyRoomHooks = (
  api: StudentStudyRoomRequests,
  base?: BaseQueryOptions
) => {
  const qo = createStudentStudyRoomQueryOptions(api, base);

  // 학생 스터디룸 목록
  const useStudentStudyRoomsQuery = (options?: { enabled?: boolean }) =>
    useQuery({
      ...qo.studentList(),
      enabled: options?.enabled ?? true,
    });

  // 스터디룸 상세 조회
  const useStudentStudyRoomDetailQuery = (
    studyRoomId: number,
    options?: { enabled?: boolean }
  ) =>
    useQuery({
      ...qo.studentDetail(studyRoomId),
      enabled: options?.enabled ?? true,
    });

  return {
    useStudentStudyRoomsQuery,
    useStudentStudyRoomDetailQuery,
  };
};
