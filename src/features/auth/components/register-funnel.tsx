'use client';

import { useState } from 'react';

import { CredentialForm } from './credential-form';
import { EmailForm } from './email-form';
import { ProfileForm } from './profile-form';
import { RegisterFormContextProvider } from './register-form-context-provider';

type Step = 'email' | 'credential' | 'profile';

export const RegisterFunnel = () => {
  const [step, setStep] = useState<Step>('email');

  return (
    <RegisterFormContextProvider>
      {step === 'email' && <EmailForm onNext={() => setStep('credential')} />}
      {step === 'credential' && (
        <CredentialForm onNext={() => setStep('profile')} />
      )}
      {step === 'profile' && <ProfileForm />}
    </RegisterFormContextProvider>
  );
};
