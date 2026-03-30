import { repository, studentKeys } from '@/entities/student';
import { useQuery } from '@tanstack/react-query';

/**
 * [GET] 학생 마이페이지 참여 스터디룸 조회
 */
export const useStudentStudyRooms = (options?: { enabled?: boolean }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: studentKeys.mypage.studyRoom(),
    queryFn: () => repository.mypage.getStudyRoomList(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

  return { data, isLoading, isError, refetch };
};
