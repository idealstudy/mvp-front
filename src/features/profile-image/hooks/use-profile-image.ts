import { profileImageKeys, repository } from '@/entities/profile-image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const PROFILE_IMAGE_EXPIRES_MS = 1000 * 60 * 60 * 3;
const PROFILE_IMAGE_STALE_TIME_MS = PROFILE_IMAGE_EXPIRES_MS - 1000 * 60 * 10;

export const useProfileImage = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: profileImageKeys.detail(),
    queryFn: () => repository.profileImage.getProfileImage(),
    staleTime: PROFILE_IMAGE_STALE_TIME_MS,
    gcTime: PROFILE_IMAGE_EXPIRES_MS,
    enabled: options?.enabled ?? true,
  });

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: repository.profileImage.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileImageKeys.detail(),
      });
    },
  });
};
