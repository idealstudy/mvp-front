import { repository, teacherKeys } from '@/entities/teacher';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * [GET] 선생님 마이페이지 전체 수업노트 조회
 */
export const useTeacherTeachingNotes = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: teacherKeys.noteList(),
    queryFn: () => repository.teachingNote.getTeacherNoteList(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

/**
 * [PATCH] 선생님 마이페이지 대표 수업노트 설정/해제
 */
export const useUpdateTeacherNoteRepresentative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teachingNoteId,
      representative,
    }: {
      teachingNoteId: number;
      representative: boolean;
    }) =>
      repository.teachingNote.setTeacherNoteRepresentative(teachingNoteId, {
        representative,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherKeys.noteList(),
      });
    },
  });
};
