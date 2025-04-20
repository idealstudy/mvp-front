'use client';

import { useRouter } from 'next/navigation';

import { useRegisterFormContext } from '@/features/auth/components/RegisterFormContextProvider';
import { useCountdown } from '@/hooks/use-countdown';

const RESEND_COUNTDOWN = 3;

export const CredentialForm = () => {
  const { countdown: resendCountdown, startCountdown } =
    useCountdown(RESEND_COUNTDOWN);

  const canResend = resendCountdown === null;

  const { credentialForm: form, invitationCodeFromLink } =
    useRegisterFormContext();

  const router = useRouter();

  const onSubmit = form.handleSubmit(() => {
    if (invitationCodeFromLink) {
      router.push(`/register/profile?code=${invitationCodeFromLink}`);
    } else {
      router.push('/register/profile');
    }
  });

  return (
    <form
      className="flex flex-col"
      onSubmit={onSubmit}
    >
      <div className="flex">
        <input
          placeholder="example@dedu.kr"
          readOnly
        />
        <button
          type="button"
          disabled={!canResend}
          onClick={startCountdown}
        >
          {resendCountdown !== null ? `${resendCountdown}초 후 재전송` : '전송'}
        </button>
      </div>
      <div className="flex">
        <input
          placeholder="이메일로 전송된 숫자 코드 여섯자리"
          {...form.register('verificationCode')}
        />
        <button>확인</button>
      </div>
      <input
        placeholder="8자 이상의 영문 소문자 및 숫자, 특수문자"
        {...form.register('verificationCode')}
      />
      <input
        placeholder="8자 이상의 영문 소문자 및 숫자, 특수문자"
        {...form.register('verificationCode')}
      />
      <button type="submit">계속</button>
    </form>
  );
};
