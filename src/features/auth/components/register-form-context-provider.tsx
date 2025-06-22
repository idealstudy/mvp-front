'use client';

import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Form } from '@/components/ui/form';
import { ROUTE } from '@/constants/route';
import { useCheckboxGroup } from '@/hooks/use-checkbox-group';
import { createContextFactory } from '@/lib/context';
import { zodResolver } from '@hookform/resolvers/zod';

import { RegisterForm } from '../schemas/register';
import { useSignUp } from '../services/query';

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
  form: ReturnType<typeof useForm<RegisterForm>>;
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

  const form = useForm<RegisterForm>({
    resolver: zodResolver(RegisterForm),
    defaultValues: {
      email: '',
      verificationCode: '',
      password: '',
      confirmPassword: '',
      role: 'ROLE_TEACHER',
      name: '',
    },
  });

  const router = useRouter();

  const { mutate: signUp, isPending } = useSignUp();

  const isAllRequiredTermsChecked = TERMS.filter((term) => term.required).every(
    (term) => termsCheckboxGroup.checkedItems.includes(term.value)
  );

  const onSubmit = form.handleSubmit((data) => {
    if (isPending) return;

    signUp(
      {
        email: form.getValues('email'),
        password: form.getValues('password'),
        acceptOptionalTerm:
          termsCheckboxGroup.checkedItems.includes('marketing'),
        name: data.name,
        role: data.role,
      },
      {
        onSuccess: () => {
          router.replace(ROUTE.HOME);
        },
        onError: () => {
          alert('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
        },
      }
    );
  });

  return (
    <RegisterFormContext
      value={{
        form,
        termsCheckboxGroup,
        isAllRequiredTermsChecked,
      }}
    >
      <Form onSubmit={onSubmit}>{children}</Form>
    </RegisterFormContext>
  );
};
