'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROUTE } from '@/constants/route';

import { useCheckEmailDuplicate } from '../services/query';
import { useRegisterFormContext } from './register-form-context-provider';

type EmailFormProps = {
  onNext: () => void;
};

export const EmailForm = ({ onNext }: EmailFormProps) => {
  const { emailForm: form } = useRegisterFormContext();

  const { mutate: checkEmailDuplicate, isPending } = useCheckEmailDuplicate();

  const onSubmit = form.handleSubmit((data) => {
    if (isPending) return;

    checkEmailDuplicate(
      { email: data.email },
      {
        onSuccess: () => {
          onNext();
        },
        onError: () => {
          form.setError('email', {
            type: 'server',
            message: '이미 사용중인 이메일입니다.',
          });
        },
      }
    );
  });

  return (
    <Form
      className="flex flex-col gap-[52px]"
      onSubmit={onSubmit}
    >
      <Form.Item error={!!form.formState.errors.email}>
        <Form.Label>이메일</Form.Label>
        <Form.Control>
          <Input
            placeholder="이메일을 입력해주세요."
            {...form.register('email')}
          />
        </Form.Control>
        <Form.ErrorMessage>
          {form.formState.errors.email?.message}
        </Form.ErrorMessage>
      </Form.Item>
      <Button type="submit">계속</Button>
      <Link
        className="flex w-fit gap-2 self-center"
        href={ROUTE.LOGIN}
      >
        <span className="text-dark-gray-02 underline">이미 가입 하셨나요?</span>
        로그인
      </Link>
    </Form>
  );
};
