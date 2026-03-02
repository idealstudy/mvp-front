import { CareerPayload, repository, teacherKeys } from '@/entities/teacher';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * [GET] 선생님 경력 조회
 */
export const useTeacherCareers = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: teacherKeys.careers(),
    queryFn: () => repository.career.getTeacherCareerList(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

/**
 * [POST] 선생님 경력 생성
 */
export const usePostTeacherCareer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (careerData: CareerPayload) =>
      repository.career.postTeacherCareer(careerData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherKeys.careers(),
      });
    },
  });
};

/**
 * [PUT] 선생님 경력 수정
 */
export const useUpdateTeacherCareer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      careerId,
      careerData,
    }: {
      careerId: number;
      careerData: CareerPayload;
    }) => repository.career.updateTeacherCareer(careerId, careerData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherKeys.careers(),
      });
    },
  });
};

/**
 * [DELETE] 선생님 경력 삭제
 */
export const useDeleteTeacherCareer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (careerId: number) =>
      repository.career.deleteTeacherCareer(careerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherKeys.careers(),
      });
    },
  });
};
