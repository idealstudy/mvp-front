'use client';

import { useEffect, useState } from 'react';

import { trackAuthSignupStepEnter } from '@/shared/lib/analytics';

import { CredentialStep } from './credential-step';
import { EmailStep } from './email-step';
import { ProfileStep } from './profile-step';
import { RegisterFormContextProvider } from './register-form-context-provider';

type Step = 'email' | 'credential' | 'profile';

export const RegisterFunnel = () => {
  const [step, setStep] = useState<Step>('email');

  // GA 회원가입 단계 추적 (이탈 단계 분석)
  useEffect(() => {
    trackAuthSignupStepEnter(step);
  }, [step]);

  return (
    <RegisterFormContextProvider>
      {step === 'email' && <EmailStep onNext={() => setStep('credential')} />}
      {step === 'credential' && (
        <CredentialStep onNext={() => setStep('profile')} />
      )}
      {step === 'profile' && <ProfileStep />}
    </RegisterFormContextProvider>
  );
};
