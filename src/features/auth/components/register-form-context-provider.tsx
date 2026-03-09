'use client';

import { useForm } from 'react-hook-form';

import { useRouter, useSearchParams } from 'next/navigation';

import { Form } from '@/shared/components/ui/form';
import { PUBLIC } from '@/shared/constants';
import { useCheckboxGroup } from '@/shared/hooks/use-checkbox-group';
import { createContextFactory } from '@/shared/lib/context';
import {
  trackAuthSignupFail,
  trackAuthSignupSuccess,
} from '@/shared/lib/gtm/trackers';
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

  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('token');

  const form = useForm<RegisterForm>({
    resolver: zodResolver(RegisterForm),
    mode: 'onChange', // 실시간 검증 활성화
    defaultValues: {
      email: '',
      verificationCode: '',
      password: '',
      confirmPassword: '',
      role: inviteToken ? 'ROLE_STUDENT' : 'ROLE_TEACHER',
      name: '',
    },
  });

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
        acceptRequiredTerm: isAllRequiredTermsChecked,
        acceptOptionalTerm:
          termsCheckboxGroup.checkedItems.includes('marketing'),
        name: data.name,
        role: data.role,
      },
      {
        onSuccess: () => {
          // 회원가입 성공 이벤트
          trackAuthSignupSuccess(data.role ?? null, 'email');
          if (inviteToken) {
            router.replace(
              `${PUBLIC.CORE.LOGIN}?token=${encodeURIComponent(inviteToken)}`
            );
          } else {
            router.replace(PUBLIC.CORE.LOGIN);
          }
        },
        onError: () => {
          trackAuthSignupFail('email');
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
