'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRegisterFormContext } from '@/features/auth/components/register-form-context-provider';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Form } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { link } from '@/shared/constants/link';
import { useCountdown } from '@/shared/hooks/use-countdown';

import { useCheckEmailDuplicate, useVerifyCode } from '../services/query';

const RESEND_COUNTDOWN = 30;
const VERIFICATION_CODE_LENGTH = 6;

type CredentialStepProps = {
  onNext: () => void;
};

export const CredentialStep = ({ onNext }: CredentialStepProps) => {
  const [emailCodeVerified, setEmailCodeVerified] = useState(false);

  const { countdown: resendCountdown, startCountdown } =
    useCountdown(RESEND_COUNTDOWN);

  const { mutate: checkEmailDuplicate, isPending: isCheckingEmailDuplicate } =
    useCheckEmailDuplicate();

  const { mutate: verifyCode, isPending: isVerifyingCode } = useVerifyCode();

  const canResend = resendCountdown === null;

  const { form, termsCheckboxGroup, isAllRequiredTermsChecked } =
    useRegisterFormContext();

  const onSendButtonClick = () => {
    if (isCheckingEmailDuplicate) return;

    checkEmailDuplicate(
      {
        email: form.getValues('email'),
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
        email: form.getValues('email'),
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

  const onNextButtonClick = async () => {
    const isValid = await form.trigger(['password', 'confirmPassword']);

    if (isValid) {
      onNext();
    }
  };

  // 비밀번호와 비밀번호 확인 필드의 유효성 확인
  const password = form.watch('password');
  const confirmPassword = form.watch('confirmPassword');
  const passwordError = form.formState.errors.password;
  const confirmPasswordError = form.formState.errors.confirmPassword;
  const isPasswordValid = !passwordError && password && password.length > 0;
  const isConfirmPasswordValid =
    !confirmPasswordError &&
    confirmPassword &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  // 모든 조건이 만족될 때만 '계속' 버튼 활성화
  const canMoveToNext =
    isAllRequiredTermsChecked &&
    emailCodeVerified &&
    isPasswordValid &&
    isConfirmPasswordValid;

  const verificationCodeInputValue = form.watch('verificationCode');

  // 비밀번호 입력 시 실시간 검증
  useEffect(() => {
    if (password) {
      void form.trigger('password');
    }
  }, [password, form]);

  // 비밀번호 확인 입력 시 실시간 검증
  useEffect(() => {
    if (confirmPassword) {
      void form.trigger(['password', 'confirmPassword']);
    }
  }, [confirmPassword, form]);

  return (
    <div className="flex flex-col gap-8">
      <Form.Item>
        <Form.Label>이메일</Form.Label>
        <div className="flex">
          <Form.Control>
            <Input
              className="rounded-r-none border-r-0"
              defaultValue={form.getValues('email')}
              readOnly
            />
          </Form.Control>
          <Button
            variant="secondary"
            className="h-[56px] rounded-l-none"
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
              className="rounded-r-none border-r-0"
              placeholder="이메일로 전송된 숫자 코드 여섯자리"
              {...form.register('verificationCode')}
            />
          </Form.Control>

          <Button
            className="h-[56px] rounded-l-none"
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
            placeholder="8자 이상의 영문 대·소문자 및 숫자, 특수문자"
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
            placeholder="8자 이상의 영문 대·소문자 및 숫자, 특수문자"
            {...form.register('confirmPassword')}
          />
        </Form.Control>
        <Form.ErrorMessage>
          {form.formState.errors.confirmPassword?.message}
        </Form.ErrorMessage>
      </Form.Item>
      <Checkbox.Group className="border-line-line1 flex flex-col gap-6 border-y py-6">
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
            디에듀 이용약관 동의 [필수]
          </Checkbox.Label>
          <Link
            href={link.terms}
            aria-label="이용약관 전문 보기"
            target="_blank"
          >
            <ChevronRightIcon />
          </Link>
        </div>
        <div className="flex items-center">
          <Checkbox.Label className="flex-1">
            <Checkbox {...termsCheckboxGroup.getCheckboxProps('privacy')} />
            개인정보 수집 및 이용방침 동의 [필수]
          </Checkbox.Label>
          <Link
            href={link.privacy}
            target="_blank"
            aria-label="개인정보 수집 및 이용방침 전문 보기"
          >
            <ChevronRightIcon />
          </Link>
        </div>
        <div className="flex items-center">
          <Checkbox.Label className="flex-1">
            <Checkbox {...termsCheckboxGroup.getCheckboxProps('ageCheck')} />만
            14세 이상입니다 [필수]
          </Checkbox.Label>
          <Link
            href={link.ageCheck}
            target="_blank"
            aria-label="만 14세 이상 이용 안내 보기"
          >
            <ChevronRightIcon />
          </Link>
        </div>
        <div className="flex items-center">
          <Checkbox.Label className="flex-1">
            <Checkbox {...termsCheckboxGroup.getCheckboxProps('marketing')} />
            혜택 및 이벤트 정보 수신 동의 [선택]
          </Checkbox.Label>
          <Link
            href={link.marketing}
            target="_blank"
            aria-label="혜택 및 이벤트 정보 수신 동의 전문 보기"
          >
            <ChevronRightIcon />
          </Link>
        </div>
      </Checkbox.Group>
      <Button
        size="large"
        onClick={onNextButtonClick}
        disabled={!canMoveToNext}
      >
        계속
      </Button>
    </div>
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
