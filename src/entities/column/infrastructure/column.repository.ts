import {
  ColumnSortOption,
  ColumnStatus,
  CreateColumnArticlePayload,
} from '@/entities/column/types';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import { dto, payload } from './column.dto';

/* ─────────────────────────────────────────────────────
 * [Read] 칼럼 목록 조회 (공개, APPROVED만)
 * ────────────────────────────────────────────────────*/
const getList = async (params: {
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
const getDetail = async (id: number) => {
  const response = await api.public.get(`/public/column-articles/${id}`);
  return unwrapEnvelope(response, dto.detail);
};

/* ─────────────────────────────────────────────────────
 * [CREATE] 칼럼 생성 (선생님 / 관리자)
 * ────────────────────────────────────────────────────*/
const create = async (
  params: CreateColumnArticlePayload,
  role: 'ROLE_TEACHER' | 'ROLE_ADMIN'
) => {
  const validated = payload.create.parse(params);
  const path =
    role === 'ROLE_ADMIN'
      ? '/admin/column-articles'
      : '/teacher/column-articles';
  await api.private.post(path, validated);
};

/* ─────────────────────────────────────────────────────
 * [READ] 선생님 마이페이지 - 내 칼럼 목록 조회
 * ────────────────────────────────────────────────────*/
const getMyList = async (params: {
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
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const repository = {
  getList,
  getDetail,
  create,
  getMyList,
};
