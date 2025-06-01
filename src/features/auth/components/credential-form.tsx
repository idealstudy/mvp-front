'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { link } from '@/constants/link';
import { useRegisterFormContext } from '@/features/auth/components/register-form-context-provider';
import { useCountdown } from '@/hooks/use-countdown';

import { useCheckEmailDuplicate, useVerifyCode } from '../services/query';

const RESEND_COUNTDOWN = 30;
const VERIFICATION_CODE_LENGTH = 6;

type CredentialFormProps = {
  onNext: () => void;
};

export const CredentialForm = ({ onNext }: CredentialFormProps) => {
  const [emailCodeVerified, setEmailCodeVerified] = useState(false);

  const { countdown: resendCountdown, startCountdown } =
    useCountdown(RESEND_COUNTDOWN);

  const { mutate: checkEmailDuplicate, isPending: isCheckingEmailDuplicate } =
    useCheckEmailDuplicate();

  const { mutate: verifyCode, isPending: isVerifyingCode } = useVerifyCode();

  const canResend = resendCountdown === null;

  const {
    credentialForm: form,
    emailForm,
    termsCheckboxGroup,
    isAllRequiredTermsChecked,
  } = useRegisterFormContext();

  const onSubmit = form.handleSubmit(() => {
    onNext();
  });

  const onSendButtonClick = () => {
    if (isCheckingEmailDuplicate) return;

    checkEmailDuplicate(
      {
        email: emailForm.getValues('email'),
      },
      {
        onSuccess: () => {
          setEmailCodeVerified(false);
          startCountdown();
        },
      }
    );
  };

  const onVerifyCodeButtonClick = () => {
    if (isVerifyingCode) return;

    verifyCode(
      {
        email: emailForm.getValues('email'),
        code: form.getValues('verificationCode'),
      },
      {
        onSuccess: () => {
          setEmailCodeVerified(true);
          form.clearErrors('verificationCode');
        },
        onError: () => {
          form.setError('verificationCode', {
            message: '올바른 인증코드가 아닙니다.',
          });
        },
      }
    );
  };

  const canSubmit = isAllRequiredTermsChecked && emailCodeVerified;

  const verificationCodeInputValue = form.watch('verificationCode');

  return (
    <Form
      className="flex flex-col gap-8"
      onSubmit={onSubmit}
    >
      <Form.Item>
        <Form.Label>이메일</Form.Label>
        <div className="flex">
          <Form.Control>
            <Input
              className="border-r-0"
              defaultValue={emailForm.getValues('email')}
              readOnly
            />
          </Form.Control>
          <Button
            variant="secondary"
            className="h-[56px]"
            disabled={!canResend}
            onClick={onSendButtonClick}
          >
            {resendCountdown !== null
              ? `${resendCountdown}초 후 재전송`
              : '전송'}
          </Button>
        </div>
      </Form.Item>
      <Form.Item error={!!form.formState.errors.verificationCode}>
        <Form.Label>인증코드</Form.Label>
        <div className="flex">
          <Form.Control>
            <Input
              disabled={emailCodeVerified}
              maxLength={VERIFICATION_CODE_LENGTH}
              className="border-r-0"
              placeholder="이메일로 전송된 숫자 코드 여섯자리"
              {...form.register('verificationCode')}
            />
          </Form.Control>

          <Button
            className="h-[56px]"
            onClick={onVerifyCodeButtonClick}
            disabled={
              emailCodeVerified ||
              verificationCodeInputValue.length !== VERIFICATION_CODE_LENGTH
            }
          >
            확인
          </Button>
        </div>
        <Form.ErrorMessage>
          {form.formState.errors.verificationCode?.message}
        </Form.ErrorMessage>
      </Form.Item>
      <Form.Item error={!!form.formState.errors.password}>
        <Form.Label>비밀번호</Form.Label>
        <Form.Control>
          <Input
            type="password"
            placeholder="8자 이상의 영문 소문자 및 숫자, 특수문자"
            {...form.register('password')}
          />
        </Form.Control>
        <Form.ErrorMessage>
          {form.formState.errors.password?.message}
        </Form.ErrorMessage>
      </Form.Item>
      <Form.Item error={!!form.formState.errors.confirmPassword}>
        <Form.Label>비밀번호 확인</Form.Label>
        <Form.Control>
          <Input
            type="password"
            placeholder="8자 이상의 영문 소문자 및 숫자, 특수문자"
            {...form.register('confirmPassword')}
          />
        </Form.Control>
        <Form.ErrorMessage>
          {form.formState.errors.confirmPassword?.message}
        </Form.ErrorMessage>
      </Form.Item>
      <Checkbox.Group className="border-light-gray-02 flex flex-col gap-6 border-y py-6">
        <Checkbox.Label className="flex-1">
          <Checkbox
            checked={termsCheckboxGroup.isAllChecked}
            onCheckedChange={termsCheckboxGroup.toggleAll}
          />
          전체 약관 동의
        </Checkbox.Label>
        <div className="flex items-center">
          <Checkbox.Label className="flex-1">
            <Checkbox {...termsCheckboxGroup.getCheckboxProps('terms')} />
            [필수] 디에듀 이용약관에 동의
          </Checkbox.Label>
          <Link
            href={link.terms}
            aria-label="이용약관 보기"
            target="_blank"
          >
            <ChevronRightIcon />
          </Link>
        </div>
        <div className="flex items-center">
          <Checkbox.Label className="flex-1">
            <Checkbox {...termsCheckboxGroup.getCheckboxProps('privacy')} />
            [필수] 개인정보 수집 및 이용방침에 동의
          </Checkbox.Label>
          <Link
            href={link.privacy}
            target="_blank"
            aria-label="개인정보 수집 및 이용방침 보기"
          >
            <ChevronRightIcon />
          </Link>
        </div>
        <div className="flex items-center">
          <Checkbox.Label className="flex-1">
            <Checkbox {...termsCheckboxGroup.getCheckboxProps('marketing')} />
            [선택] 마케팅 정보 수신 및 선택적 개인정보 제공
          </Checkbox.Label>
          <Link
            href={link.marketing}
            target="_blank"
            aria-label="마케팅 정보 수신 및 선택적 개인정보 제공 보기"
          >
            <ChevronRightIcon />
          </Link>
        </div>
      </Checkbox.Group>
      <Button
        type="submit"
        disabled={!canSubmit}
      >
        계속
      </Button>
    </Form>
  );
};

const ChevronRightIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g clipPath="url(#clip0_80_364)">
        <path
          d="M8.27148 2.27197L18.0216 12.0221L8.27148 21.7722"
          stroke="black"
          strokeWidth="2"
        />
      </g>
      <defs>
        <clipPath id="clip0_80_364">
          <rect
            width="24"
            height="24"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
