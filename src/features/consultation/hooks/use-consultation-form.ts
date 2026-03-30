import { useRouter } from 'next/navigation';

import { CreateConsultationPayload, repository } from '@/entities/consultation';
import { useMutation } from '@tanstack/react-query';

/**
 * [POST] 문의 작성
 */
export function useCreateConsultation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (params: CreateConsultationPayload) =>
      repository.createConsultation(params),
    onSuccess: (data) => {
      router.replace(`/consultation/${data.id}`);
    },
  });
}
