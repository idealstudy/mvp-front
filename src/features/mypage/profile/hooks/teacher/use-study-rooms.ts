import { repository, teacherKeys } from '@/entities/teacher';
import { useQuery } from '@tanstack/react-query';

/**
 * [GET] 선생님 마이페이지 스터디룸 목록 조회
 */
export const useTeacherStudyRooms = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: teacherKeys.studyRoomList(),
    queryFn: () => repository.getTeacherStudyRoomList(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
