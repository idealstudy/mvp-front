'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROUTE } from '@/constants/route';

import { useCheckEmailDuplicate } from '../services/query';
import { useRegisterFormContext } from './register-form-context-provider';

type EmailStepProps = {
  onNext: () => void;
};

export const EmailStep = ({ onNext }: EmailStepProps) => {
  const { form } = useRegisterFormContext();

  const { mutate: checkEmailDuplicate, isPending } = useCheckEmailDuplicate();

  const onNextButtonClick = async () => {
    if (isPending) return;

    const isValid = await form.trigger(['email']);

    if (!isValid) return;

    checkEmailDuplicate(
      { email: form.getValues('email') },
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
  };

  return (
    <div className="flex flex-col gap-[52px]">
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
      <Button
        size="large"
        onClick={onNextButtonClick}
      >
        계속
      </Button>
      <Link
        className="flex w-fit gap-2 self-center"
        href={ROUTE.LOGIN}
      >
        <span className="text-gray-scale-gray-70 underline">
          이미 가입 하셨나요?
        </span>
        로그인
      </Link>
    </div>
  );
};
