import { ColumnStatus, columnKeys, repository } from '@/entities/column';
import { useQuery } from '@tanstack/react-query';

const PAGE_SIZE = 10;

export const useMyColumns = (params: { page: number; status?: ColumnStatus }) =>
  useQuery({
    queryKey: columnKeys.myList({ ...params, size: PAGE_SIZE }),
    queryFn: () => repository.getMyColumnList({ ...params, size: PAGE_SIZE }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
