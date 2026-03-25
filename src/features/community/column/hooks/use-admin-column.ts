import { ColumnStatus, columnKeys, repository } from '@/entities/column';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * [GET] 칼럼 목록 조회 (관리자)
 */
export const useAdminColumnList = (params: {
  page: number;
  size: number;
  status?: ColumnStatus;
}) =>
  useQuery({
    queryKey: columnKeys.adminList(params),
    queryFn: () => repository.getAdminColumnList(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

/**
 * [PATCH] 칼럼 승인 (관리자)
 */
export const useApproveColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => repository.approveColumn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: columnKeys.all });
    },
  });
};
