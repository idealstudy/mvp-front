import { profileKeys, repository } from '@/entities/profile';
import { ProfileUpdateForm } from '@/features/profile/schema/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 프로필 조회
export const useProfile = (memberId?: string) =>
  useQuery({
    queryKey: profileKeys.profile(memberId),
    queryFn: () => repository.profile.getProfile(memberId!),
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    enabled: !!memberId,
  });

export const useTeacherUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileUpdateForm) => {
      const promises = [];

      if (data.desc)
        promises.push(repository.profile.updateTeacherDescription(data.desc));

      // TODO 프로필 사진, 공개 범위 설정 추가

      return Promise.all(promises);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.all }),
  });
};
