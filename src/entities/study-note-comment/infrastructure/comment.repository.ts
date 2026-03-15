import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';
import { CommonResponse } from '@/types';

import {
  CommentCreateRequestDTO,
  CommentListDTO,
  CommentReadListDTO,
  CommentUpdateRequestDTO,
} from '../types';
import { dto } from './comment.dto';

/* ─────────────────────────────────────────────────────
 * [Read] 댓글/대댓글 목록 조회
 * ──────────────────────────────────────────────────── */
const getCommentList = async (teachingNoteId: number) => {
  const response = await api.public.get<CommonResponse<CommentListDTO>>(
    `/public/teaching-notes/${teachingNoteId}/comments`
  );

  return unwrapEnvelope(response, dto.list);
};

/* ─────────────────────────────────────────────────────
 * [Read] 댓글 읽음 사용자 목록 조회
 * ──────────────────────────────────────────────────── */
const getReadCommentList = async (
  teachingNoteId: number,
  commentId: number
) => {
  const response = await api.public.get<CommonResponse<CommentReadListDTO>>(
    `/public/teaching-notes/${teachingNoteId}/comments/${commentId}/readers`
  );

  return unwrapEnvelope(response, dto.readList);
};

/* ─────────────────────────────────────────────────────
 * [Create] 댓글/대댓글 생성
 * ──────────────────────────────────────────────────── */
const createComment = async (
  teachingNoteId: number,
  data: CommentCreateRequestDTO
) => {
  await api.public.post(`/public/teaching-notes/${teachingNoteId}/comments`, {
    data,
  });
};

/* ─────────────────────────────────────────────────────
 * [Update] 댓글/대댓글 수정
 * ──────────────────────────────────────────────────── */
const updateComment = async (
  teachingNoteId: number,
  commentId: number,
  data: CommentUpdateRequestDTO
) => {
  await api.public.put(
    `/public/teaching-notes/${teachingNoteId}/comments/${commentId}`,
    { data }
  );
};

/* ─────────────────────────────────────────────────────
 * [Delete] 댓글/대댓글 삭제
 * ──────────────────────────────────────────────────── */
const deleteComment = async (teachingNoteId: number, commentId: number) => {
  await api.public.delete(
    `/public/teaching-notes/${teachingNoteId}/comments/${commentId}`
  );
};

export const repository = {
  comment: {
    create: createComment,
    update: updateComment,
    delete: deleteComment,
    getCommentList,
    getReadCommentList,
  },
};
