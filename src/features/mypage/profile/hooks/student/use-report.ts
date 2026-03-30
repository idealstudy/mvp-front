import { repository, studentKeys } from '@/entities/student';
import { useQuery } from '@tanstack/react-query';

/**
 * [GET] 학생 마이페이지 누적 활동 리포트 조회
 */
export const useStudentReport = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: studentKeys.mypage.report(),
    queryFn: () => repository.mypage.getReport(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
