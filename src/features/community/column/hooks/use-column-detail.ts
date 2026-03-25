import { ColumnDetail, columnKeys, repository } from '@/entities/column';
import { useQuery } from '@tanstack/react-query';

/**
 * [GET] 칼럼 상세 조회
 */
export const useColumnDetail = (
  id: number,
  initialData?: ColumnDetail,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: columnKeys.detail(id),
    queryFn: () => repository.getColumnDetail(id),
    initialData,
    initialDataUpdatedAt: Date.now(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
