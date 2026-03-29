import { consultationKeys, repository } from '@/entities/consultation';
import { StudyNoteQueryKey } from '@/entities/study-note';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useConsultationList = (
  studyRoomId: number,
  studentId: number,
  page = 0,
  enabled = true
) =>
  useQuery({
    queryKey: [...consultationKeys.list(studyRoomId, studentId), page],
    queryFn: () => repository.getList(studyRoomId, studentId, page),
    enabled: !!studyRoomId && !!studentId && enabled,
  });

export const useConsultationDetail = (
  studyRoomId: number,
  studentId: number,
  sheetId: number | null,
  enabled = true
) => {
  return useQuery({
    queryKey: consultationKeys.detail(studyRoomId, studentId, sheetId!),
    queryFn: () => repository.getDetail(studyRoomId, studentId, sheetId!),
    staleTime: 0,
    enabled: !!studyRoomId && !!studentId && !!sheetId && enabled,
  });
};

export const useCreateConsultation = (
  studyRoomId: number,
  studentId: number
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { content: string; mediaIds?: string[] }) =>
      repository.create(studyRoomId, studentId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: consultationKeys.list(studyRoomId, studentId),
      });
      queryClient.invalidateQueries({
        queryKey: StudyNoteQueryKey.membersPrefix('teacher', studyRoomId),
      });
    },
  });
};

export const useUpdateConsultation = (
  studyRoomId: number,
  studentId: number
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sheetId,
      content,
      mediaIds,
    }: {
      sheetId: number;
      content: string;
      mediaIds?: string[];
    }) =>
      repository.update(studyRoomId, studentId, sheetId, { content, mediaIds }),
    onSuccess: (_data, { sheetId }) => {
      queryClient.invalidateQueries({
        queryKey: consultationKeys.list(studyRoomId, studentId),
      });
      queryClient.invalidateQueries({
        queryKey: consultationKeys.detail(studyRoomId, studentId, sheetId),
      });
    },
  });
};

export const useDeleteConsultation = (
  studyRoomId: number,
  studentId: number
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sheetId }: { sheetId: number }) =>
      repository.delete(studyRoomId, studentId, sheetId),
    onSuccess: (_data, { sheetId }) => {
      queryClient.invalidateQueries({
        queryKey: consultationKeys.list(studyRoomId, studentId),
      });
      queryClient.removeQueries({
        queryKey: consultationKeys.detail(studyRoomId, studentId, sheetId),
      });
      queryClient.invalidateQueries({
        queryKey: StudyNoteQueryKey.membersPrefix('teacher', studyRoomId),
      });
    },
  });
};
