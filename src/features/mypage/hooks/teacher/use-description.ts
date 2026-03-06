import {
  UpdateTeacherDescriptionPayload,
  repository,
  teacherKeys,
} from '@/entities/teacher';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * [GET] 선생님 특징 조회
 */
export const useTeacherDescription = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: teacherKeys.description(),
    queryFn: () => repository.description.getTeacherDescription(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

/**
 * [PATCH] 선생님 특징 수정
 */
export const useUpdateTeacherDescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTeacherDescriptionPayload) =>
      repository.description.updateDescription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherKeys.description(),
      });
    },
  });
};
