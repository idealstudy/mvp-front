import { NoteListQuery, repository, teacherKeys } from '@/entities/teacher';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

/**
 * [GET] 선생님 마이페이지 전체 수업노트 조회
 */
export const useTeacherTeachingNotes = (
  params: Omit<NoteListQuery, 'page'>,
  options?: { enabled?: boolean }
) =>
  useInfiniteQuery({
    queryKey: teacherKeys.noteList({ ...params, page: 0 }),
    queryFn: ({ pageParam }) =>
      repository.teachingNote.getTeacherNoteList({
        ...params,
        page: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.pageNumber + 1 < lastPage.totalPages
        ? lastPage.pageNumber + 1
        : undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

/**
 * [GET] 선생님 마이페이지 대표 수업노트 조회
 */
export const useTeacherRepresentativeTeachingNotes = (options?: {
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: teacherKeys.representativeNoteList(),
    queryFn: () => repository.teachingNote.getTeacherRepresentativeNoteList(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

/**
 * [PATCH] 선생님 마이페이지 대표 수업노트 설정/해제
 * Optimistic Update 적용
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
        queryKey: teacherKeys.noteListAll(),
      });
    },
  });
};
