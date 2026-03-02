'use client';

import { useForm } from 'react-hook-form';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import SocialLoginButton from '@/features/auth/components/social-login-button';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { PUBLIC } from '@/shared/constants';
import { extractErrorMessage } from '@/shared/lib/bff/utils.message';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';

import { LoginFormValues, loginSchema } from '../schemas/login';

const LoginFormtwStyles = {
  wrapper: 'space-y-10 pb-10 pt-4',
  link: 'text-key-color-primary underline w-fit',
};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('token');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const { login, isLoggingIn } = useAuth();

  const onSubmit = async (data: LoginFormValues) => {
    login(data, {
      onError: (error) => {
        let message = '로그인에 실패하였습니다. 잠시 후 다시 시도하주세요.';

        if (error instanceof AxiosError) {
          const serverMessage = extractErrorMessage(error.response?.data);
          message = serverMessage || message;
        }

        setError('password', {
          type: 'server',
          message,
        });
      },
    });
  };

  const isLoading = isLoggingIn || isSubmitting;
  const isInValid = Object.keys(errors).length > 0;

  return (
    <>
      <p className="mt-10 w-fit text-[20px] font-medium">소셜 로그인</p>
      <SocialLoginButton />

      <div className="text-text-sub2 mt-10 flex items-center justify-between gap-1">
        <hr className="border-line-line2 flex-1 border" />
        <span>D&apos;edu로 이메일로 로그인</span>
        <hr className="border-line-line2 flex-1 border" />
      </div>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        className={LoginFormtwStyles.wrapper}
      >
        <Form.Item error={!!errors.email}>
          <Form.Label>이메일</Form.Label>
          <Form.Control>
            <Input
              type="email"
              {...register('email')}
            />
          </Form.Control>
          <Form.ErrorMessage>{errors.email?.message}</Form.ErrorMessage>
        </Form.Item>

        <Form.Item error={!!errors.password}>
          <Form.Label>비밀번호</Form.Label>
          <Form.Control>
            <Input
              type="password"
              {...register('password')}
            />
          </Form.Control>
          <Form.ErrorMessage>{errors.password?.message}</Form.ErrorMessage>
        </Form.Item>

        <Button
          type="submit"
          disabled={isLoading || isInValid}
          className="w-full"
        >
          {isLoading ? '로그인 중...' : '계속'}
        </Button>

        <div className="flex justify-center gap-2">
          <span>아직 회원이 아니신가요?</span>
          <Link
            href={
              inviteToken
                ? `${PUBLIC.CORE.SIGNUP}?token=${encodeURIComponent(inviteToken)}`
                : PUBLIC.CORE.SIGNUP
            }
            className={LoginFormtwStyles.link}
          >
            회원가입
          </Link>
        </div>
      </Form>
    </>
  );
}
