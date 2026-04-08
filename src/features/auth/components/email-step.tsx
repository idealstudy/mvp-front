'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { PUBLIC } from '@/shared/constants/route';
import { extractErrorMessage } from '@/shared/lib/bff/utils.message';
import { AxiosError } from 'axios';

import { useCheckEmailDuplicate } from '../services/query';
import { useRegisterFormContext } from './register-form-context-provider';

type EmailStepProps = {
  onNext: () => void;
};

export const EmailStep = ({ onNext }: EmailStepProps) => {
  const { form } = useRegisterFormContext();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('token');
  const loginHref = inviteToken
    ? `${PUBLIC.CORE.LOGIN}?token=${encodeURIComponent(inviteToken)}`
    : PUBLIC.CORE.LOGIN;
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
        onError: (error: unknown) => {
          // 서버 메시지 우선 사용, 없으면 기본 메시지
          let message = '이미 사용중인 이메일입니다.';

          if (error instanceof AxiosError) {
            const serverMessage = extractErrorMessage(error.response?.data);
            if (serverMessage) {
              message = serverMessage;
            } else if (error.response?.status === 500) {
              message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            } else if (!error.response) {
              message = '네트워크 오류가 발생했습니다. 연결을 확인해주세요.';
            }
          } else if (error instanceof Error) {
            message = error.message || message;
          }

          form.setError('email', {
            type: 'server',
            message,
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
            data-testid="signup-email-input"
            {...form.register('email')}
          />
        </Form.Control>
        <Form.ErrorMessage data-testid="signup-email-error-message">
          {form.formState.errors.email?.message}
        </Form.ErrorMessage>
      </Form.Item>
      <Button
        size="large"
        onClick={onNextButtonClick}
        data-testid="signup-email-next-button"
      >
        계속
      </Button>

      <div className="flex justify-center gap-2">
        <span>이미 가입 하셨나요?</span>
        <Link
          href={loginHref}
          className="text-key-color-primary w-fit underline"
        >
          로그인
        </Link>
      </div>
    </div>
  );
};
