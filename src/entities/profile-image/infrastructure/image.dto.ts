import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 프로필 이미지 응답 DTO
 * GET /api/members/profile-image
 * PUT /api/members/profile-image
 * ────────────────────────────────────────────────────*/
const ProfileImageDtoSchema = z.object({
  imageUrl: z.string(),
  expiresAt: z.string(),
});

/* ─────────────────────────────────────────────────────
 * 프로필 이미지 변경 Payload
 * PUT /api/members/profile-image
 * ────────────────────────────────────────────────────*/
const UpdateProfileImagePayloadSchema = z.object({
  mediaId: z.string(),
});

export const dto = {
  profileImage: ProfileImageDtoSchema,
};

export const payload = {
  updateProfileImage: UpdateProfileImagePayloadSchema,
};
