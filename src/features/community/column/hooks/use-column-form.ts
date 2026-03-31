import { useRouter } from 'next/navigation';

import {
  CreateColumnArticlePayload,
  UpdateColumnArticlePayload,
  columnKeys,
  repository,
} from '@/entities/column';
import { PUBLIC } from '@/shared/constants';
import { useMemberStore } from '@/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * [POST] 칼럼 생성
 */
export const useCreateColumn = () => {
  const role = useMemberStore((state) => state.member?.role);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (params: CreateColumnArticlePayload) => {
      if (role !== 'ROLE_TEACHER' && role !== 'ROLE_ADMIN') {
        throw new Error('권한이 없습니다.');
      }
      return repository.createColumn(params, role);
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: columnKeys.all });
      if (role === 'ROLE_ADMIN') {
        router.replace(PUBLIC.COMMUNITY.COLUMN.DETAIL(id));
      } else {
        router.replace(`${PUBLIC.COMMUNITY.COLUMN.DETAIL(id)}?preview=true`);
      }
    },
  });
};

/**
 * [PUT] 칼럼 수정
 */
export const useUpdateColumn = (id: number) => {
  const role = useMemberStore((state) => state.member?.role);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (params: UpdateColumnArticlePayload) => {
      if (role !== 'ROLE_TEACHER' && role !== 'ROLE_ADMIN') {
        throw new Error('권한이 없습니다.');
      }
      return repository.updateColumn(id, params, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: columnKeys.all });
      if (role === 'ROLE_ADMIN') {
        router.replace(PUBLIC.COMMUNITY.COLUMN.DETAIL(id));
      } else {
        router.replace(`${PUBLIC.COMMUNITY.COLUMN.DETAIL(id)}?preview=true`);
      }
    },
  });
};

/**
 * [DELETE] 칼럼 삭제
 */
export const useDeleteColumn = () => {
  const role = useMemberStore((state) => state.member?.role);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      if (role !== 'ROLE_TEACHER' && role !== 'ROLE_ADMIN') {
        throw new Error('권한이 없습니다.');
      }
      return repository.deleteColumn(id, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: columnKeys.all });
    },
  });
};
