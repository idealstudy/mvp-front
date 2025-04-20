import { z } from 'zod';

export type CredentialForm = z.infer<typeof CredentialForm>;
export const CredentialForm = z.object({
  verificationCode: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export type ProfileForm = z.infer<typeof ProfileForm>;
export const ProfileForm = z.object({
  role: z.string(),
  name: z.string(),
  invitationCode: z.string(),
});
