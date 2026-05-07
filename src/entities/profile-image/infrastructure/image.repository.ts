import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';
import { CommonResponse } from '@/types';

import { ProfileImageDTO, UpdateProfileImagePayload } from '../types';
import { dto, payload } from './image.dto';

/* ─────────────────────────────────────────────────────
 * 프로필 이미지
 * GET /api/members/profile-image
 * ────────────────────────────────────────────────────*/
const getProfileImage = async (): Promise<ProfileImageDTO> => {
  const response = await api.private.get<CommonResponse<ProfileImageDTO>>(
    `/members/profile-image`
  );
  return unwrapEnvelope(response, dto.profileImage);
};

/* ─────────────────────────────────────────────────────
 * 프로필 이미지
 * PUT /api/members/profile-image
 * ────────────────────────────────────────────────────*/
const updateProfileImage = async (
  body: UpdateProfileImagePayload
): Promise<ProfileImageDTO> => {
  const validated = payload.updateProfileImage.parse(body);
  const response = await api.private.put(`/members/profile-image`, validated);

  return unwrapEnvelope(response, dto.profileImage);
};

export const repository = {
  profileImage: {
    getProfileImage,
    update: updateProfileImage,
  },
};
