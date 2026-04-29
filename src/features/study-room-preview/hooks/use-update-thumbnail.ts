import { revalidateStudyRoomList } from '@/app/(home)/list/study-rooms/actions';
import { studyRoomRepository } from '@/entities/study-room';
import { studyRoomsQueryKey } from '@/entities/study-room';
import { previewKeys } from '@/entities/study-room-preview';
import { useImageUpload } from '@/shared/components/editor';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateThumbnail = (teacherId: number, studyRoomId: number) => {
  const queryClient = useQueryClient();
  const { uploadAsync } = useImageUpload();

  return useMutation({
    mutationFn: async (file: File | null) => {
      if (file === null) {
        return studyRoomRepository.teacher.updateThumbnail(studyRoomId, null);
      }

      const { mediaId } = await uploadAsync(file);
      return studyRoomRepository.teacher.updateThumbnail(studyRoomId, mediaId);
    },
    onSuccess: () => {
      revalidateStudyRoomList();
      queryClient.invalidateQueries({
        queryKey: studyRoomsQueryKey.teacherDetail(studyRoomId),
      });
      queryClient.invalidateQueries({
        queryKey: previewKeys.side(teacherId, studyRoomId),
      });
    },
  });
};
