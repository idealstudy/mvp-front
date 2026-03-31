import {
  CreateConsultationAnswerPayload,
  CreateConsultationPayload,
} from '@/entities/consultation/types';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import { dto, payload } from './consultation.dto';

/* ─────────────────────────────────────────────────────
 * [CREATE] 수업 문의 등록
 * ────────────────────────────────────────────────────*/
const createConsultation = async (params: CreateConsultationPayload) => {
  const validated = payload.create.parse(params);
  const response = await api.private.post('/common/inquiries', validated);
  return unwrapEnvelope(response, dto.detail);
};

/* ─────────────────────────────────────────────────────
 * [READ] 문의 내용 상세 조회 (작성자 / 선생님)
 * ────────────────────────────────────────────────────*/
const getConsultation = async (id: number) => {
  const response = await api.private.get(`/common/inquiries/${id}`);
  return unwrapEnvelope(response, dto.detail);
};

/* ─────────────────────────────────────────────────────
 * [CREATE] 문의 답변 작성 (선생님)
 * ────────────────────────────────────────────────────*/
const createConsultationAnswer = async (
  id: number,
  params: CreateConsultationAnswerPayload
) => {
  const validated = payload.createAnswer.parse(params);
  const response = await api.private.post(
    `/teacher/inquiries/${id}/answer`,
    validated
  );
  return unwrapEnvelope(response, dto.detail);
};

/* ─────────────────────────────────────────────────────
 * [READ] 마이페이지 내가 작성한 문의 목록 조회
 * ────────────────────────────────────────────────────*/
const getMyConsultations = async (params: { page: number; size: number }) => {
  const response = await api.private.get('/common/inquiries', { params });
  return unwrapEnvelope(response, dto.list);
};

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const repository = {
  createConsultation,
  getConsultation,
  createConsultationAnswer,
  getMyConsultations,
};
