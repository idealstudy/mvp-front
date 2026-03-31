import { ClassLinkQueryKey, classLinkRepository } from '@/entities/class-link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useClassLinkListQuery = (
  studyRoomId: number,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ClassLinkQueryKey.list(studyRoomId),
    queryFn: () => classLinkRepository.getList(studyRoomId),
    enabled: options?.enabled,
  });

export const useCreateClassLink = (studyRoomId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; url: string }) =>
      classLinkRepository.createClassLink(studyRoomId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ClassLinkQueryKey.list(studyRoomId) });
    },
  });
};

export const useEditClassLink = (studyRoomId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      linkId,
      body,
    }: {
      linkId: number;
      body: { name: string; url: string };
    }) => classLinkRepository.editClassLink(studyRoomId, linkId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ClassLinkQueryKey.list(studyRoomId) });
    },
  });
};

export const useDeleteClassLink = (studyRoomId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (linkId: number) =>
      classLinkRepository.deleteClassLink(studyRoomId, linkId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ClassLinkQueryKey.list(studyRoomId) });
    },
  });
};
