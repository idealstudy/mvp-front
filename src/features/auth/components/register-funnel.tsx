'use client';

import { useState } from 'react';

import { CredentialStep } from './credential-step';
import { EmailStep } from './email-step';
import { ProfileStep } from './profile-step';
import { RegisterFormContextProvider } from './register-form-context-provider';

type Step = 'email' | 'credential' | 'profile';

export const RegisterFunnel = () => {
  const [step, setStep] = useState<Step>('email');

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
