import {
  CreateConsultationAnswerPayload,
  consultationKeys,
  repository,
} from '@/entities/consultation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateConsultationAnswer(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateConsultationAnswerPayload) =>
      repository.createConsultationAnswer(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultationKeys.detail(id) });
    },
  });
}
