import { ReviewPayload } from '@/entities/review/types';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import { dto, payload } from './review.dto';

const createReview = async (studyRoomId: number, params: ReviewPayload) => {
  const validated = payload.create.parse(params);
  const response = await api.private.post(
    `/common/review/${studyRoomId}`,
    validated
  );
  return unwrapEnvelope(response, dto.detail);
};

export const repository = {
  createReview,
};
