import { ColumnDetail, columnKeys, repository } from '@/entities/column';
import { useQuery } from '@tanstack/react-query';

export const useColumnDetail = (id: number, initialData?: ColumnDetail) =>
  useQuery({
    queryKey: columnKeys.detail(id),
    queryFn: () => repository.getDetail(id),
    initialData,
    initialDataUpdatedAt: Date.now(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
