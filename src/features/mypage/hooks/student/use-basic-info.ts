import {
  UpdateStudentBasicInfoPayload,
  repository,
  studentKeys,
} from '@/entities/student';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// [GET] 학생 기본 정보 조회
export const useStudentBasicInfo = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: studentKeys.basicInfo(),
    queryFn: () => repository.basicInfo.getBasicInfo(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

// [PATCH] 학생 기본 정보 변경
export const useUpdateStudentBasicInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (basicInfo: UpdateStudentBasicInfoPayload) =>
      repository.basicInfo.updateBasicInfo(basicInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.basicInfo(),
      });
    },
  });
};
