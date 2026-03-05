import { StudyNoteQueryKey } from '@/entities/study-note';
import { StudyRoomsGroupQueryKey } from '@/entities/study-note-group/infrastructure';
import type { StudyNote } from '@/features/study-notes/model';
import { StudyRoomDetail, StudyRoomsQueryKey } from '@/features/study-rooms';
import type { PaginationData } from '@/types/http';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import {
  createStudyNoteGroup,
  deleteStudyNoteGroup,
  deleteStudyRoom,
  updateStudyNoteGroup,
  updateStudyRoom,
  updateStudyRoomTitle,
} from './api';

export const useCreateStudyNoteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudyNoteGroup,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          StudyRoomsGroupQueryKey.all,
          {
            pageable: { page: 0, size: 20, sort: ['desc'] },
            studyRoomId: variables.studyRoomId,
          },
          'ROLE_TEACHER',
        ],
      });
    },
  });
};

export const useUpdateStudyNoteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      teachingNoteGroupId: number;
      title: string;
      studyRoomId: number;
    }) => updateStudyNoteGroup(args),

    onMutate: async (variables) => {
      const previous = queryClient.getQueriesData({
        queryKey: StudyNoteQueryKey.all,
      });

      // Optimistic Update: 모든 노트 목록에서 그룹명 즉시 변경
      queryClient.setQueriesData(
        { queryKey: StudyNoteQueryKey.all },
        (old: PaginationData<StudyNote> | undefined) => {
          if (!old?.content) return old;
          return {
            ...old,
            content: old.content.map((note) =>
              note.groupId === variables.teachingNoteGroupId
                ? { ...note, groupName: variables.title }
                : note
            ),
          };
        }
      );

      return { previous };
    },

    onError: (_, __, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: (_, __, variables) => {
      // 수정된 그룹의 노트 쿼리 제거
      queryClient.removeQueries({
        queryKey: StudyNoteQueryKey.byGroupPrefix(
          variables.studyRoomId,
          variables.teachingNoteGroupId
        ),
      });

      // 그룹 목록 갱신
      queryClient.invalidateQueries({
        queryKey: [
          StudyRoomsGroupQueryKey.all,
          {
            pageable: { page: 0, size: 20, sort: ['desc'] },
            studyRoomId: variables.studyRoomId,
          },
          'ROLE_TEACHER',
        ],
      });
    },
  });
};

export const useDeleteStudyNoteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { teachingNoteGroupId: number; studyRoomId: number }) =>
      deleteStudyNoteGroup(args),

    onMutate: async (variables) => {
      const previous = queryClient.getQueriesData({
        queryKey: StudyNoteQueryKey.all,
      });

      // Optimistic Update: 모든 노트 목록에서 삭제된 그룹 정보 제거
      queryClient.setQueriesData(
        { queryKey: StudyNoteQueryKey.all },
        (old: PaginationData<StudyNote> | undefined) => {
          if (!old?.content) return old;
          return {
            ...old,
            content: old.content.map((note) =>
              note.groupId === variables.teachingNoteGroupId
                ? { ...note, groupId: null, groupName: '' }
                : note
            ),
          };
        }
      );

      return { previous };
    },

    onError: (_, __, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: (_, __, variables) => {
      // 삭제된 그룹의 노트 쿼리 제거
      queryClient.removeQueries({
        queryKey: StudyNoteQueryKey.byGroupPrefix(
          variables.studyRoomId,
          variables.teachingNoteGroupId
        ),
      });

      // 그룹 목록 갱신
      queryClient.invalidateQueries({
        queryKey: [
          StudyRoomsGroupQueryKey.all,
          {
            pageable: { page: 0, size: 20, sort: ['desc'] },
            studyRoomId: variables.studyRoomId,
          },
          'ROLE_TEACHER',
        ],
      });
    },
  });
};

// 스터디룸 제목 수정
export const useUpdateStudyRoomTitle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: {
      studyRoomId: number;
      name: string;
      others: StudyRoomDetail;
    }) => updateStudyRoomTitle(args),

    onMutate: async ({ studyRoomId, name }) => {
      // 이전 데이터 백업
      const previous = queryClient.getQueryData(
        StudyRoomsQueryKey.detail(studyRoomId)
      );

      // Optimistic Update: UI 즉시 반영
      queryClient.setQueryData<StudyRoomDetail | undefined>(
        StudyRoomsQueryKey.detail(studyRoomId),
        (old) => (old ? { ...old, name } : undefined)
      );

      return { previous };
    },

    onError: (_, variables, context) => {
      // 실패 시 롤백
      queryClient.setQueryData(
        StudyRoomsQueryKey.detail(variables.studyRoomId),
        context?.previous
      );
    },

    onSettled: (_, __, variables) => {
      // 서버 데이터와 동기화
      queryClient.invalidateQueries({
        queryKey: StudyRoomsQueryKey.detail(variables.studyRoomId),
      });

      // 사이드바 갱신
      queryClient.invalidateQueries({
        queryKey: StudyRoomsQueryKey.teacherList,
      });
      queryClient.invalidateQueries({
        queryKey: StudyRoomsQueryKey.studentList,
      });
    },
  });
};

// 스터디룸 수정
export const useUpdateStudyRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { studyRoomId: number; others: StudyRoomDetail }) =>
      updateStudyRoom(args),

    onMutate: async ({ studyRoomId }) => {
      // 이전 데이터 백업
      const previous = queryClient.getQueryData(
        StudyRoomsQueryKey.detail(studyRoomId)
      );

      // Optimistic Update: UI 즉시 반영
      queryClient.setQueryData<StudyRoomDetail | undefined>(
        StudyRoomsQueryKey.detail(studyRoomId),
        (old) => (old ? { ...old } : undefined)
      );

      return { previous };
    },

    onError: (_, variables, context) => {
      // 실패 시 롤백
      queryClient.setQueryData(
        StudyRoomsQueryKey.detail(variables.studyRoomId),
        context?.previous
      );
    },

    onSettled: (_, __, variables) => {
      // 서버 데이터와 동기화
      queryClient.invalidateQueries({
        queryKey: StudyRoomsQueryKey.detail(variables.studyRoomId),
      });

      // 사이드바 갱신
      queryClient.invalidateQueries({
        queryKey: StudyRoomsQueryKey.teacherList,
      });
      queryClient.invalidateQueries({
        queryKey: StudyRoomsQueryKey.studentList,
      });
    },
  });
};

export const useDeleteStudyRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { studyRoomId: number }) => deleteStudyRoom(args),

    onSuccess: (_, variables) => {
      const id = variables.studyRoomId;
      queryClient.invalidateQueries({
        queryKey: StudyRoomsQueryKey.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: StudyRoomsQueryKey.teacherList,
      });
      queryClient.invalidateQueries({
        queryKey: StudyRoomsQueryKey.studentList,
      });
    },
  });
};
