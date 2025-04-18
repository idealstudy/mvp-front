'use client';

import { useForm } from 'react-hook-form';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginFormtwStyles = {
  wrapper: 'space-y-10 pb-[138px] pt-[42px]',
  label: 'mb-2 block text-xl font-medium text-[#111111]',
  input: 'w-full rounded border px-6 py-[18.5px]',
  submit:
    'mt-[6px] w-full cursor-pointer rounded bg-[#FF4805] py-5 text-white transition-opacity hover:opacity-90 font-bold',
  link: 'text-orange-600 underline mx-auto w-fit',
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={LoginFormtwStyles.wrapper}
    >
      <div>
        <label className={LoginFormtwStyles.label}>이메일</label>
        <input
          type="email"
          {...register('email')}
          className={LoginFormtwStyles.input}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className={LoginFormtwStyles.label}>비밀번호</label>
        <input
          type="password"
          {...register('password')}
          className={LoginFormtwStyles.input}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={LoginFormtwStyles.submit}
      >
        {isSubmitting ? '로딩 중...' : '계속'}
      </button>
      <div className={LoginFormtwStyles.link}>
        <Link href={'#'}>로그인이 안되시나요?</Link>
      </div>
    </form>
  );
}
