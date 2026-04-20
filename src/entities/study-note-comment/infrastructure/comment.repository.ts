import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';
import { CommonResponse } from '@/types';

import { domain } from '../core';
import {
  CommentCreateRequestDTO,
  CommentList,
  CommentListDTO,
  CommentReadList,
  CommentReadListDTO,
  CommentUpdateRequestDTO,
  ParentCommentList,
  ParentCommentListDTO,
} from '../types';

/* ─────────────────────────────────────────────────────
 * [Read] 댓글/대댓글 목록 조회
 * ──────────────────────────────────────────────────── */
const getCommentList = async (teachingNoteId: number): Promise<CommentList> => {
  const response = await api.private.get<CommonResponse<CommentListDTO>>(
    `/common/teaching-notes/${teachingNoteId}/comments`
  );

  return unwrapEnvelope(response.data, domain.list);
};

/* ─────────────────────────────────────────────────────
 * [Read] 댓글 읽음 사용자 목록 조회
 * ──────────────────────────────────────────────────── */
const getReadCommentList = async (
  teachingNoteId: number,
  commentId: number
): Promise<CommentReadList> => {
  const response = await api.private.get<CommonResponse<CommentReadListDTO>>(
    `/common/teaching-notes/${teachingNoteId}/comments/${commentId}/readers`
  );

  return unwrapEnvelope(response.data, domain.readList);
};

/* ─────────────────────────────────────────────────────
 * [Read] 부모님 - 댓글 목록 조회
 * ──────────────────────────────────────────────────── */
const getParentCommentList = async (
  studentId: number,
  teachingNoteId: number
): Promise<ParentCommentList> => {
  const response = await api.private.get<CommonResponse<ParentCommentListDTO>>(
    `/parent/student/${studentId}/teaching-notes/${teachingNoteId}/comments`
  );

  return unwrapEnvelope(response, domain.parentList);
};

/* ─────────────────────────────────────────────────────
 * [Create] 댓글/대댓글 생성
 * ──────────────────────────────────────────────────── */
const createComment = async (
  teachingNoteId: number,
  data: CommentCreateRequestDTO
) => {
  await api.private.post(
    `/common/teaching-notes/${teachingNoteId}/comments`,
    data
  );
};

/* ─────────────────────────────────────────────────────
 * [Update] 댓글/대댓글 수정
 * ──────────────────────────────────────────────────── */
const updateComment = async (
  teachingNoteId: number,
  commentId: number,
  data: CommentUpdateRequestDTO
) => {
  await api.private.put(
    `/common/teaching-notes/${teachingNoteId}/comments/${commentId}`,
    data
  );
};

/* ─────────────────────────────────────────────────────
 * [Delete] 댓글/대댓글 삭제
 * ──────────────────────────────────────────────────── */
const deleteComment = async (teachingNoteId: number, commentId: number) => {
  await api.private.delete(
    `/common/teaching-notes/${teachingNoteId}/comments/${commentId}`
  );
};

export const repository = {
  comment: {
    create: createComment,
    update: updateComment,
    delete: deleteComment,
    getCommentList,
    getReadCommentList,
    getParentCommentList,
  },
};
