import { repository, reviewKeys } from '@/entities/review';
import type { ReviewUpdatePayload } from '@/entities/review';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateReview = (reviewId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ReviewUpdatePayload) =>
      repository.update(reviewId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
};
