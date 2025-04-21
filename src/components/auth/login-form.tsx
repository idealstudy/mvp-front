'use client';

import { useForm } from 'react-hook-form';

import Link from 'next/link';

import { useLoginMutation } from '@/features/auth/services/query';
import { LoginFormValues, loginSchema } from '@/schema/login';
import { zodResolver } from '@hookform/resolvers/zod';

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

  const { mutate } = useLoginMutation();

  const onSubmit = async (data: LoginFormValues) => {
    mutate(data);
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

      <Link href={'#'}>
        <p className={LoginFormtwStyles.link}>로그인이 안되시나요?</p>
      </Link>
    </form>
  );
}
