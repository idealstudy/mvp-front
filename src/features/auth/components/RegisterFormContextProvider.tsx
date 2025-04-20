'use client';

import { useForm } from 'react-hook-form';

import { useSearchParams } from 'next/navigation';

import { createContextFactory } from '@/lib/context';
import { zodResolver } from '@hookform/resolvers/zod';

import { CredentialForm, ProfileForm } from '../schemas/register';

const INVITATION_CODE_KEY = 'code';

type RegisterFormContextValue = {
  credentialForm: ReturnType<typeof useForm<CredentialForm>>;
  profileForm: ReturnType<typeof useForm<ProfileForm>>;
  invitationCodeFromLink: string | null;
};

const [RegisterFormContext, useRegisterFormContext] =
  createContextFactory<RegisterFormContextValue | null>('RegisterForm');
export { useRegisterFormContext };

export const RegisterFormContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const searchParams = useSearchParams();
  const invitationCodeFromLink = searchParams.get(INVITATION_CODE_KEY);

  const credentialForm = useForm<CredentialForm>({
    resolver: zodResolver(CredentialForm),
    defaultValues: {
      verificationCode: '',
      password: '',
      confirmPassword: '',
    },
  });

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(ProfileForm),
    defaultValues: {
      role: '',
      name: '',
      invitationCode: invitationCodeFromLink ?? '',
    },
  });

  return (
    <RegisterFormContext
      value={{ credentialForm, profileForm, invitationCodeFromLink }}
    >
      {children}
    </RegisterFormContext>
  );
};
