import { z } from 'zod';

import { dto, payload } from '../infrastructure/image.dto';

export type ProfileImageDTO = z.infer<typeof dto.profileImage>;
export type UpdateProfileImagePayload = z.infer<
  typeof payload.updateProfileImage
>;
