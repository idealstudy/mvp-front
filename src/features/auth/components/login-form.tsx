'use client';

import { useForm } from 'react-hook-form';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLoginMutation } from '@/features/auth/services/query';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoginFormValues, loginSchema } from '../schemas/login';

const LoginFormtwStyles = {
  wrapper: 'space-y-10 pb-[138px] pt-[42px]',
  link: 'text-key-color-primary underline mx-auto w-fit',
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const { mutate, isPending } = useLoginMutation();

  const onSubmit = async (data: LoginFormValues) => {
    mutate(data, {
      onError: (error) => {
        setError('password', {
          type: 'server',
          message: error.message || '서버에서 에러가 발생하였습니다.',
        });
      },
    });
  };

  const isLoading = isPending || isSubmitting;
  const isInValid = Object.keys(errors).length > 0;

  return (
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

      <Link href={'#'}>
        <p className={LoginFormtwStyles.link}>로그인이 안되시나요?</p>
      </Link>
    </Form>
  );
}
