import { member } from '@/entities/member';
import { z } from 'zod';

// 8~16자, 영문 대문자, 소문자, 숫자, 특수문자를 모두 포함
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;

const PHONE_REGEX = /^010-\d{4}-\d{4}$/;

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
          '비밀번호는 8~16자, 영문 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
      }),
    confirmPassword: z.string(),
    role: member.domain.role,
    name: z.string().min(1, { message: '이름을 입력해주세요.' }), // TODO: 최대 길이 추가
    phoneNumber: z.string().regex(PHONE_REGEX, {
      message: '올바른 전화번호 형식을 입력해주세요.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });
