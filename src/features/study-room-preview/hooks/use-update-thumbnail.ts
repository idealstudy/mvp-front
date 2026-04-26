import { studyRoomRepository } from '@/entities/study-room';
import { previewKeys } from '@/entities/study-room-preview';
import { useImageUpload } from '@/shared/components/editor';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateThumbnail = (teacherId: number, studyRoomId: number) => {
  const queryClient = useQueryClient();
  const { uploadAsync } = useImageUpload();

  return useMutation({
    mutationFn: async (file: File) => {
      const { mediaId } = await uploadAsync(file);
      return studyRoomRepository.teacher.updateThumbnail(studyRoomId, mediaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: previewKeys.side(teacherId, studyRoomId),
      });
    },
  });
};
