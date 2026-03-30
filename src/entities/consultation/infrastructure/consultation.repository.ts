import { CreateConsultationPayload } from '@/entities/consultation/types';
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
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const repository = {
  createConsultation,
};
