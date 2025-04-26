import { z } from 'zod';

import { USER_ROLES } from '../services/api';

export type CredentialForm = z.infer<typeof CredentialForm>;
export const CredentialForm = z
  .object({
    email: z
      .string()
      .min(1, { message: '이메일을 입력해주세요.' })
      .email({ message: '올바른 이메일 형식을 입력해주세요.' }),
    verificationCode: z.string(),
    password: z.string().min(1, {
      message: '비밀번호를 입력해주세요.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type ProfileForm = z.infer<typeof ProfileForm>;
export const ProfileForm = z.object({
  role: z.enum(USER_ROLES),
  name: z.string().min(1, { message: '이름을 입력해주세요.' }),
  invitationCode: z.string(),
});
