import { StudyNoteQueryKey } from '@/entities/study-note';
import { studyRoomsQueryKey } from '@/entities/study-room';
import { teacherMutationOptions } from '@/features/study-notes/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const createTeacherStudyNoteMutations = () => {
  // 노트 수정
  const useUpdateStudyNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
      ...teacherMutationOptions.update(),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: StudyNoteQueryKey.all,
        });
      },
    });
  };

  // 노트 그룹 이동
  const useMoveNoteToGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
      ...teacherMutationOptions.moveToGroup(),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: StudyNoteQueryKey.all,
        });
      },
    });
  };

  // 노트 그룹 해제
  const useRemoveNoteFromGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
      ...teacherMutationOptions.removeFromGroup(),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: StudyNoteQueryKey.all,
        });
      },
    });
  };

  // 수업 노트 삭제
  const useRemoveStudyNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
      ...teacherMutationOptions.removeStudyNote(),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: StudyNoteQueryKey.listPrefix(variables.studyRoomId),
        });
        if (variables.groupId != null) {
          queryClient.invalidateQueries({
            queryKey: StudyNoteQueryKey.byGroupPrefix(
              variables.studyRoomId,
              variables.groupId
            ),
          });
        }
        queryClient.invalidateQueries({
          queryKey: studyRoomsQueryKey.detail(variables.studyRoomId),
        });
      },
    });
  };

  return {
    useUpdateStudyNote,
    useMoveNoteToGroup,
    useRemoveNoteFromGroup,
    useRemoveStudyNote,
  };
};
