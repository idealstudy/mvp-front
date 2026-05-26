import { repository, reviewKeys } from '@/entities/review';
import type { ReviewCreatePayload } from '@/entities/review';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studyRoomId,
      ...params
    }: { studyRoomId: number } & ReviewCreatePayload) =>
      repository.create(studyRoomId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
};
