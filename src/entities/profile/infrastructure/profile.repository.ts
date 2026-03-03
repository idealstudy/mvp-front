import { profileMapper } from '@/entities/profile/mapper';
import { FrontendProfile, ProfileDTO } from '@/entities/profile/types';
import { api } from '@/shared/api';
import { CommonResponse } from '@/types';

import { adapters } from './profile.adapters';

/* ─────────────────────────────────────────────────────
 * [Read] 프로필 조회
 * ────────────────────────────────────────────────────*/
const getProfile = async (memberId: string): Promise<FrontendProfile> => {
  const response = await api.public.get<CommonResponse<ProfileDTO>>(
    `/public/members/profile/${memberId}`
  );

  const validateResponse = adapters.fromApi.parse(response);

  return profileMapper.toDomain(validateResponse.data ?? []);
};

/* ─────────────────────────────────────────────────────
 * [Update] 선생님 간단 소개 변경
 * ────────────────────────────────────────────────────*/
const updateTeacherDescription = async (description: string): Promise<void> => {
  await api.private.patch('/teacher/profile', { profile: description });
};

export const repository = {
  profile: {
    getProfile,
    updateTeacherDescription,
  },
};
