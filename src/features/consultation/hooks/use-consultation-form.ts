import { useRouter } from 'next/navigation';

import { CreateConsultationPayload, repository } from '@/entities/consultation';
import { previewKeys } from '@/entities/study-room-preview';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * [POST] 문의 작성
 */
export function useCreateConsultation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateConsultationPayload) =>
      repository.createConsultation(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: previewKeys.all,
      });
      router.replace(`/consultation/${data.id}`);
    },
  });
}
