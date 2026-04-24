import { useRouter } from 'next/navigation';

import { repository } from '@/entities/member';
import { useMemberStore } from '@/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useWithdraw = () => {
  const queryClient = useQueryClient();
  const { clearMember } = useMemberStore();
  const router = useRouter();

  return useMutation({
    mutationFn: repository.member.withdraw,
    onSuccess: () => {
      clearMember();
      queryClient.clear();
      router.replace('/');
    },
  });
};
