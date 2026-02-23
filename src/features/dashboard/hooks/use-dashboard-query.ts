import { repository, teacherKeys } from '@/entities/teacher';
import type { Dashboard } from '@/features/dashboard';
import { options } from '@/features/dashboard/api';
import type { BaseQueryOptions } from '@/shared/lib/query/types';
import { useQuery } from '@tanstack/react-query';

/**
 * @description 대시보드 메인 데이터를 비동기로 불러오는 React Query 훅입니다.
 *
 * @param {BaseQueryOptions} [base={}] - 기본 설정을 덮어쓰기 위한 옵션.
 * @returns {import('@tanstack/react-query').UseQueryResult<Dashboard>} 쿼리 결과.
 */
export const useDashboardQuery = (base: BaseQueryOptions = {}) => {
  const dashboardData = options.getDashboard(base);
  /* ─────────────────────────────────────────────────────
   * 타입 충돌 이슈가 프로젝트에 남아 있다면 as any를 사용해야 할 수 있습니다.
   * Ex. return useQuery<Dashboard>(queryOptions as any);
   * 타입이 정상적으로 해결되었다고 가정하고 표준 형태로 작성합니다.
   * ────────────────────────────────────────────────────*/
  return useQuery<Dashboard>(dashboardData);
};

export const useTeacherDashboardReportQuery = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: teacherKeys.report(),
    queryFn: () => repository.getTeacherReport(),
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled ?? true,
  });
};
