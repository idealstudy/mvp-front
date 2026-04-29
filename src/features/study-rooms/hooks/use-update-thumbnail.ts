import { revalidateStudyRoomList } from '@/app/(home)/list/study-rooms/actions';
import { studyRoomRepository } from '@/entities/study-room';
import { previewKeys } from '@/entities/study-room-preview';
import { StudyRoomsQueryKey } from '@/features/study-rooms/api';
import { useImageUpload } from '@/shared/components/editor';
import { useMemberStore } from '@/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateThumbnail = (studyRoomId: number) => {
  const queryClient = useQueryClient();
  const { uploadAsync } = useImageUpload();
  const teacherId = useMemberStore((s) => s.member?.id);

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
        queryKey: StudyRoomsQueryKey.teacherDetail(studyRoomId),
      });
      if (teacherId) {
        queryClient.invalidateQueries({
          queryKey: previewKeys.side(teacherId, studyRoomId),
        });
      }
    },
  });
};
