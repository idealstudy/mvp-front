'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginFormtwStyles = {
  label: 'mb-1 block text-sm font-semibold',
  input: 'w-full rounded border px-3 py-2',
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <form
      // action={}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
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

      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer rounded bg-orange-500 py-2 text-white transition-opacity hover:opacity-90"
      >
        {isSubmitting ? '로딩 중...' : '로그인'}
      </button>
    </form>
  );
}
