import type {
  CommentCreateRequestDTO,
  CommentList,
  CommentReadList,
  CommentUpdateRequestDTO,
} from '@/entities/study-note-comment';
import { commentKeys, repository } from '@/entities/study-note-comment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const ONE_MINUTE = 60 * 1000;

// 스터디 노트 답글 info

export const useCommentList = (teachingNoteId: number) =>
  useQuery<CommentList>({
    queryKey: commentKeys.list(teachingNoteId),
    queryFn: () => repository.comment.getCommentList(teachingNoteId),
    enabled: Number.isInteger(teachingNoteId) && teachingNoteId > 0,
    refetchInterval: ONE_MINUTE,
    refetchOnWindowFocus: true,
  });

// 스터디 노트 읽음상태 체크 리스트 info
export const useReadCommentList = (
  teachingNoteId: number,
  commentId: number,
  enabled = true
) =>
  useQuery<CommentReadList>({
    queryKey: commentKeys.readList(teachingNoteId, commentId),
    queryFn: () =>
      repository.comment.getReadCommentList(teachingNoteId, commentId),
    enabled:
      enabled &&
      Number.isInteger(teachingNoteId) &&
      teachingNoteId > 0 &&
      Number.isInteger(commentId) &&
      commentId > 0,
    refetchInterval: ONE_MINUTE,
    refetchOnWindowFocus: true,
  });

// 답글 달기
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teachingNoteId,
      data,
    }: {
      teachingNoteId: number;
      data: CommentCreateRequestDTO;
    }) => repository.comment.create(teachingNoteId, data),
    onSuccess: (_, { teachingNoteId }) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(teachingNoteId),
      });
    },
  });
};

// 답글 수정
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teachingNoteId,
      commentId,
      data,
    }: {
      teachingNoteId: number;
      commentId: number;
      data: CommentUpdateRequestDTO;
    }) => repository.comment.update(teachingNoteId, commentId, data),
    onSuccess: (_, { teachingNoteId }) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(teachingNoteId),
      });
    },
  });
};

// 답글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teachingNoteId,
      commentId,
    }: {
      teachingNoteId: number;
      commentId: number;
    }) => repository.comment.delete(teachingNoteId, commentId),
    onSuccess: (_, { teachingNoteId }) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(teachingNoteId),
      });
    },
  });
};
