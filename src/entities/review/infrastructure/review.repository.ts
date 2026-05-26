import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';
import { z } from 'zod';

import { dto, payload } from './review.dto';

const createReview = async (
  studyRoomId: number,
  params: z.infer<typeof payload.create>
) => {
  const validated = payload.create.parse(params);
  const response = await api.private.post(
    `/common/review/${studyRoomId}`,
    validated
  );
  return unwrapEnvelope(response, dto.item);
};

const updateReview = async (
  reviewId: number,
  params: z.infer<typeof payload.update>
) => {
  const validated = payload.update.parse(params);
  const response = await api.private.put(
    `/common/review/${reviewId}`,
    validated
  );
  return unwrapEnvelope(response, dto.item);
};

const deleteReview = async (reviewId: number) => {
  await api.private.delete(`/common/review/${reviewId}`);
};

export const repository = {
  create: createReview,
  update: updateReview,
  delete: deleteReview,
};
