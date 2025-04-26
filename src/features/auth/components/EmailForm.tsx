'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROUTE } from '@/constants/route';

import { useRegisterFormContext } from './RegisterFormContextProvider';

export const EmailForm = () => {
  const router = useRouter();
  const { emailForm: form } = useRegisterFormContext();

  const onSubmit = form.handleSubmit(() => {
    // 중복 검사

    router.push(ROUTE.SIGNUP.CREDENTIAL);
  });

  return (
    <Form
      className="mx-auto flex max-w-[570px] flex-col gap-[52px] px-4"
      onSubmit={onSubmit}
    >
      <Form.Item error={!!form.formState.errors.email}>
        <Form.Label>이메일</Form.Label>
        <Form.Control>
          <Input
            type="email"
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
