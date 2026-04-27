import { memberKeys } from '@/entities/member';
import {
  UpdateParentBasicInfoPayload,
  parentKeys,
  repository,
} from '@/entities/parent';
import { useMemberStore } from '@/store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * [GET] 부모님 기본 정보 조회
 */
export const useParentBasicInfo = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: parentKeys.mypage.basicInfo(),
    queryFn: () => repository.mypage.getBasicInfo(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

/**
 * [PATCH] 부모님 기본 정보 변경
 */
export const useUpdateParentBasicInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (basicInfo: UpdateParentBasicInfoPayload) =>
      repository.mypage.updateBasicInfo(basicInfo),
    onSuccess: (_, basicInfo) => {
      const { member, setMember } = useMemberStore.getState();

      if (member) {
        setMember({
          ...member,
          name: basicInfo.name,
        });
      }
      queryClient.invalidateQueries({
        queryKey: parentKeys.mypage.basicInfo(),
      });
      queryClient.invalidateQueries({
        queryKey: memberKeys.info(),
      });
    },
  });
};
