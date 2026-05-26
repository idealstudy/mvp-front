import { repository, reviewKeys } from '@/entities/review';
import { handleApiError } from '@/shared/lib/errors/error-handler';
import { classifyReviewError } from '@/shared/lib/errors/errors';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteReview = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => repository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      onSuccess?.();
    },
    onError: (error) => {
      handleApiError(error, classifyReviewError, {
        onField: () => {},
        onContext: () => {},
        onAuth: () => {},
        onUnknown: () => {},
      });
    },
  });
};
