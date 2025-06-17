import { z } from 'zod';

import { ROLES } from '../type';

// 8~16자, 최소 하나의 문자, 하나의 숫자, 하나의 특수문자 포함
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;

export type RegisterForm = z.infer<typeof RegisterForm>;
export const RegisterForm = z
  .object({
    email: z
      .string()
      .min(1, { message: '이메일을 입력해주세요.' })
      .email({ message: '올바른 이메일 형식을 입력해주세요.' }), // TODO: 최대 길이 추가
    verificationCode: z.string(),
    password: z
      .string()
      .min(1, {
        message: '비밀번호를 입력해주세요.',
      })
      .regex(PASSWORD_REGEX, {
        message:
          '비밀번호는 8~16자, 최소 하나의 문자, 하나의 숫자, 하나의 특수문자를 포함해야 합니다.',
      }),
    confirmPassword: z.string(),
    role: z.enum(ROLES),
    name: z.string().min(1, { message: '이름을 입력해주세요.' }), // TODO: 최대 길이 추가
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });
