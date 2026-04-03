import { Role } from '@/entities/member';
import { Pageable } from '@/types/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QnAStatus, QnAVisibility } from '../types';
import {
  deleteQnA,
  deleteStudentQnAMessage,
  deleteTeacherQnAMessage,
  getStudentQnADetail,
  getStudentQnAList,
  getTeacherQnADetail,
  getTeacherQnAList,
  updateQnAStatus,
  updateQnATitle,
  updateStudentQnAMessage,
  updateTeacherQnAMessage,
  writeQnA,
  writeStudentQnAMessage,
  writeTeacherQnAMessage,
} from './api';

export const useQnAsQuery = (
  role: Role | undefined,
  args: {
    studyRoomId: number;
    pageable: Pageable;
    status?: string;
    sort?: string;
    searchKeyword?: string;
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ['qnaList', role, args],
    queryFn: async () => {
      if (role === 'ROLE_TEACHER') return getTeacherQnAList(args);
      if (role === 'ROLE_STUDENT') return getStudentQnAList(args);
      throw new Error('role not ready');
    },
    enabled:
      (args.enabled ?? true) &&
      (role === 'ROLE_TEACHER' || role === 'ROLE_STUDENT'),
  });
};

export const useQnADetailQuery = (
  role: Role | undefined,
  args: { studyRoomId: number; contextId: number }
) => {
  return useQuery({
    queryKey: ['qnaDetail', role, args],
    queryFn: async () => {
      if (role === 'ROLE_TEACHER') return getTeacherQnADetail(args);
      if (role === 'ROLE_STUDENT') return getStudentQnADetail(args);
      throw new Error('role not ready');
    },
    enabled: role === 'ROLE_TEACHER' || role === 'ROLE_STUDENT',
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useWriteQnAMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      studyRoomId: number;
      title: string;
      content: string;
      visibility: QnAVisibility;
      mediaIds?: string[];
      relatedTeachingNoteId?: number;
    }) => writeQnA(args),
    onSuccess: () => {
      // QNA 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['qnaList'],
        refetchType: 'active',
      });
    },
  });
};

export const useWriteQnAMessageMutation = (role: Role | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      studyRoomId: number;
      contextId: number;
      content: string;
      mediaIds?: string[];
    }) => {
      if (role === 'ROLE_TEACHER') return writeTeacherQnAMessage(args);
      if (role === 'ROLE_STUDENT') return writeStudentQnAMessage(args);
      throw new Error('role not ready');
    },
    onSuccess: (_, variables) => {
      // QNA 상세 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [
          'qnaDetail',
          role,
          {
            studyRoomId: variables.studyRoomId,
            contextId: variables.contextId,
          },
        ],
        refetchType: 'active',
      });
    },
  });
};

export const useUpdateQnAMessageMutation = (role: Role | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      studyRoomId: number;
      contextId: number;
      messageId: number;
      content: string;
      mediaIds?: string[];
    }) => {
      if (role === 'ROLE_TEACHER')
        return updateTeacherQnAMessage({
          studyRoomId: args.studyRoomId,
          contextId: args.contextId,
          messageId: args.messageId,
          content: args.content,
          mediaIds: args.mediaIds,
        });
      if (role === 'ROLE_STUDENT')
        return updateStudentQnAMessage({
          studyRoomId: args.studyRoomId,
          contextId: args.contextId,
          messageId: args.messageId,
          content: args.content,
          mediaIds: args.mediaIds,
        });
      throw new Error('role not ready');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          'qnaDetail',
          role,
          {
            studyRoomId: variables.studyRoomId,
            contextId: variables.contextId,
          },
        ],
        refetchType: 'active',
      });
    },
  });
};

export const useDeleteQnAMessageMutation = (role: Role | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      studyRoomId: number;
      contextId: number;
      messageId: number;
    }) => {
      if (role === 'ROLE_TEACHER')
        return deleteTeacherQnAMessage({
          studyRoomId: args.studyRoomId,
          contextId: args.contextId,
          messageId: args.messageId,
        });
      if (role === 'ROLE_STUDENT')
        return deleteStudentQnAMessage({
          studyRoomId: args.studyRoomId,
          contextId: args.contextId,
          messageId: args.messageId,
        });
      throw new Error('role not ready');
    },
    onSuccess: (_, variables) => {
      // QNA 상세 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [
          'qnaDetail',
          role,
          {
            studyRoomId: variables.studyRoomId,
            contextId: variables.contextId,
          },
        ],
        refetchType: 'active',
      });
    },
  });
};

// QNA 컨텍스트(질문) 제목 수정
export const useUpdateQnAContextMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      studyRoomId: number;
      contextId: number;
      title: string;
    }) => updateQnATitle(args),
    onSuccess: (_data, variables) => {
      // QNA 목록 및 상세 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['qnaList'],
        refetchType: 'active',
      });
      queryClient.invalidateQueries({
        queryKey: [
          'qnaDetail',
          undefined, // role은 모든 역할에 대해 무효화
          {
            studyRoomId: variables.studyRoomId,
            contextId: variables.contextId,
          },
        ],
        refetchType: 'active',
      });
    },
  });
};

// QNA 컨텍스트(질문) 삭제
export const useDeleteQnAContextMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { studyRoomId: number; contextId: number }) =>
      deleteQnA(args),
    onSuccess: () => {
      // QNA 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['qnaList'],
        refetchType: 'active',
      });
    },
  });
};

// QNA Status 수정
export const useUpdateQnAStatus = (role: Role | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: {
      studyRoomId: number;
      contextId: number;
      status: QnAStatus;
    }) => updateQnAStatus(args),

    onSuccess: (_data, variables) => {
      // QnA 목록 무효화 (선생님 기준)
      queryClient.invalidateQueries({
        queryKey: ['qnaList'],
        refetchType: 'active',
      });

      // QnA 상세 무효화 (현재 role 기준)
      queryClient.invalidateQueries({
        queryKey: [
          'qnaDetail',
          role,
          {
            studyRoomId: variables.studyRoomId,
            contextId: variables.contextId,
          },
        ],
        refetchType: 'active',
      });
    },
  });
};
