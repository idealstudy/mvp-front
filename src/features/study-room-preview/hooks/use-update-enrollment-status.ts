import { revalidateStudyRoomList } from '@/app/(home)/list/study-rooms/actions';
import { studyRoomRepository } from '@/entities/study-room';
import { studyRoomsQueryKey } from '@/entities/study-room';
import { previewKeys } from '@/entities/study-room-preview';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateEnrollmentStatus = (studyRoomId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: 'OPEN' | 'OPERATING') =>
      studyRoomRepository.teacher.updateEnrollmentStatus(studyRoomId, status),
    onSuccess: () => {
      revalidateStudyRoomList();
      queryClient.invalidateQueries({
        queryKey: studyRoomsQueryKey.teacherDetail(studyRoomId),
      });
      queryClient.invalidateQueries({
        queryKey: previewKeys.main(studyRoomId),
      });
    },
  });
};
