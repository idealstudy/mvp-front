import { ColumnSortOption, columnKeys, repository } from '@/entities/column';
import { useQuery } from '@tanstack/react-query';

const PAGE_SIZE = 10;

/**
 * [GET] 칼럼 목록 조회
 */
export const useColumnList = (params: {
  page: number;
  sort: ColumnSortOption;
}) =>
  useQuery({
    queryKey: columnKeys.list({ ...params, size: PAGE_SIZE }),
    queryFn: () => repository.getColumnList({ ...params, size: PAGE_SIZE }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
