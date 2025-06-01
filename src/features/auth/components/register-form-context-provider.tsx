'use client';

import { useForm } from 'react-hook-form';

import { useCheckboxGroup } from '@/hooks/use-checkbox-group';
import { createContextFactory } from '@/lib/context';
import { zodResolver } from '@hookform/resolvers/zod';

import { CredentialForm, EmailForm, ProfileForm } from '../schemas/register';

const TERMS = [
  {
    value: 'terms',
    required: true,
  },
  {
    value: 'privacy',
    required: true,
  },
  {
    value: 'marketing',
    required: false,
  },
] as const;

type RegisterFormContextValue = {
  emailForm: ReturnType<typeof useForm<EmailForm>>;
  credentialForm: ReturnType<typeof useForm<CredentialForm>>;
  profileForm: ReturnType<typeof useForm<ProfileForm>>;
  termsCheckboxGroup: ReturnType<
    typeof useCheckboxGroup<(typeof TERMS)[number]['value']>
  >;
  isAllRequiredTermsChecked: boolean;
};

const [RegisterFormContext, useRegisterFormContext] =
  createContextFactory<RegisterFormContextValue | null>('RegisterForm');
export { useRegisterFormContext };

export const RegisterFormContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const termsCheckboxGroup = useCheckboxGroup(TERMS.map((term) => term.value));

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(EmailForm),
    defaultValues: {
      email: '',
    },
  });

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
      role: 'ROLE_TEACHER',
      name: '',
    },
  });

  const isAllRequiredTermsChecked = TERMS.filter((term) => term.required).every(
    (term) => termsCheckboxGroup.checkedItems.includes(term.value)
  );

  return (
    <RegisterFormContext
      value={{
        emailForm,
        credentialForm,
        profileForm,
        termsCheckboxGroup,
        isAllRequiredTermsChecked,
      }}
    >
      {children}
    </RegisterFormContext>
  );
};
