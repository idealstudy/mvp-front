'use client';

import { Controller } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROUTE } from '@/constants/route';
import { useRegisterFormContext } from '@/features/auth/components/register-form-context-provider';

import { useSignUp } from '../services/query';
import { RoleRadioGroup } from './role-radio-group';

export const ProfileForm = () => {
  const { profileForm, credentialForm, emailForm, termsCheckboxGroup } =
    useRegisterFormContext();

  const router = useRouter();

  const { mutate: signUp, isPending } = useSignUp();

  const onSubmit = profileForm.handleSubmit((data) => {
    if (isPending) return;

    signUp(
      {
        email: emailForm.getValues('email'),
        password: credentialForm.getValues('password'),
        acceptOptionalTerm:
          termsCheckboxGroup.checkedItems.includes('marketing'),
        name: data.name,
        role: data.role,
      },
      {
        onSuccess: () => {
          router.replace(ROUTE.HOME);
        },
      }
    );
  });

  return (
    <Form
      className="flex flex-col gap-8"
      onSubmit={onSubmit}
    >
      <Form.Item>
        <Form.Label>사용 유형</Form.Label>
        <Form.Control>
          <Controller
            name="role"
            control={profileForm.control}
            render={({ field }) => <RoleRadioGroup {...field} />}
          />
        </Form.Control>
      </Form.Item>
      <Form.Item error={!!profileForm.formState.errors.name}>
        <Form.Label>이름</Form.Label>
        <Form.Control>
          <Input
            placeholder="수업에 사용할 실명"
            {...profileForm.register('name')}
          />
        </Form.Control>
      </Form.Item>
      <Button type="submit">가입 완료</Button>
    </Form>
  );
};
