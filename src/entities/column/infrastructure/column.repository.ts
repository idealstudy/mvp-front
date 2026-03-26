import {
  ColumnSortOption,
  ColumnStatus,
  CreateColumnArticlePayload,
  UpdateColumnArticlePayload,
} from '@/entities/column/types';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';
import { z } from 'zod';

import { dto, payload } from './column.dto';

/* ─────────────────────────────────────────────────────
 * [Read] 칼럼 목록 조회 (공개, APPROVED만)
 * ────────────────────────────────────────────────────*/
const getColumnList = async (params: {
  page: number;
  size: number;
  sort: ColumnSortOption;
}) => {
  const response = await api.public.get('/public/column-articles', { params });
  return unwrapEnvelope(response, dto.page);
};

/* ─────────────────────────────────────────────────────
 * [READ] 칼럼 상세 조회 (공개)
 * ────────────────────────────────────────────────────*/
const getColumnDetail = async (id: number) => {
  const response = await api.public.get(`/public/column-articles/${id}`);
  return unwrapEnvelope(response, dto.detail);
};

/* ─────────────────────────────────────────────────────
 * [CREATE] 칼럼 생성 (선생님 / 관리자)
 * ────────────────────────────────────────────────────*/
const createColumn = async (
  params: CreateColumnArticlePayload,
  role: 'ROLE_TEACHER' | 'ROLE_ADMIN'
) => {
  const validated = payload.create.parse(params);
  const path =
    role === 'ROLE_ADMIN'
      ? '/admin/column-articles'
      : '/teacher/column-articles';
  const response = await api.private.post(path, validated);
  return unwrapEnvelope(response, z.number());
};

/* ─────────────────────────────────────────────────────
 * [DELETE] 칼럼 삭제 (선생님)
 * TODO 관리자 반영
 * ────────────────────────────────────────────────────*/
const deleteColumn = async (id: number) => {
  await api.private.delete(`/teacher/column-articles/${id}`);
};

/* ─────────────────────────────────────────────────────
 * [UPDATE] 칼럼 수정 (선생님 / 관리자)
 * ────────────────────────────────────────────────────*/
const updateColumn = async (
  id: number,
  params: UpdateColumnArticlePayload,
  role: 'ROLE_TEACHER' | 'ROLE_ADMIN'
) => {
  const validated = payload.update.parse(params);
  const path =
    role === 'ROLE_ADMIN'
      ? `/admin/column-articles/${id}`
      : `/teacher/column-articles/${id}`;
  await api.private.put(path, validated);
};

/* ─────────────────────────────────────────────────────
 * [READ] 마이페이지 - 내 칼럼 목록 조회 (선생님)
 * ────────────────────────────────────────────────────*/
const getMyColumnList = async (params: {
  page: number;
  size: number;
  status?: ColumnStatus;
}) => {
  const response = await api.private.get('/teacher/me/column-articles', {
    params,
  });
  return unwrapEnvelope(response, dto.myPage);
};

/* ─────────────────────────────────────────────────────
 * [READ] 칼럼 상세 조회 (선생님, PENDING 포함)
 * ────────────────────────────────────────────────────*/
const getMyColumnDetail = async (id: number) => {
  const response = await api.private.get(`/teacher/column-articles/${id}`);
  return unwrapEnvelope(response, dto.detail);
};

/* ─────────────────────────────────────────────────────
 * [READ] 관리자페이지 - 칼럼 목록 조회 (관리자, 상태별)
 * ────────────────────────────────────────────────────*/
const getAdminColumnList = async (params: {
  page: number;
  size: number;
  status?: ColumnStatus;
}) => {
  const response = await api.private.get('/admin/column-articles', { params });
  return unwrapEnvelope(response, dto.adminPage);
};

/* ─────────────────────────────────────────────────────
 * [PATCH] 관리자페이지 - 칼럼 승인 (관리자)
 * ────────────────────────────────────────────────────*/
const approveColumn = async (id: number) => {
  await api.private.patch(`/admin/column-articles/${id}/approve`);
};

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const repository = {
  getColumnList,
  getColumnDetail,
  createColumn,
  updateColumn,
  deleteColumn,
  getMyColumnList,
  getMyColumnDetail,
  getAdminColumnList,
  approveColumn,
};
