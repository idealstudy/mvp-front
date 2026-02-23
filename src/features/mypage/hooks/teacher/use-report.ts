import { repository, teacherKeys } from '@/entities/teacher';
import { useQuery } from '@tanstack/react-query';

// [GET] 선생님 마이페이지 활동 통계 조회
export const useTeacherReport = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: teacherKeys.report(),
    queryFn: () => repository.getTeacherReport(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
