import { ColumnDetail, columnKeys, repository } from '@/entities/column';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
    queryFn: () => repository.getColumnDetailWithAuth(id),
    initialData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

/**
 * [GET] 칼럼 상세 조회 (선생님, PENDING 포함)
 */
export const useMyColumnDetail = (
  id: number,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: columnKeys.myDetail(id),
    queryFn: () => repository.getMyColumnDetail(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

export const useToggleColumnLike = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => repository.toggleColumnLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: columnKeys.all });
    },
  });
};
