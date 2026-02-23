import {
  UpdateTeacherBasicInfoPayload,
  repository,
  teacherKeys,
} from '@/entities/teacher';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// [GET] 선생님 기본 정보 조회
export const useTeacherBasicInfo = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: teacherKeys.basicInfo(),
    queryFn: () => repository.basicInfo.getBasicInfo(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

// [PATCH] 선생님 기본 정보 변경
export const useUpdateTeacherBasicInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (basicInfo: UpdateTeacherBasicInfoPayload) =>
      repository.basicInfo.updateBasicInfo(basicInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherKeys.basicInfo(),
      });
    },
  });
};
