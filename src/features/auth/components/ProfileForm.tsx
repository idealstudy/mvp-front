'use client';

import { Controller } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROUTE } from '@/constants/route';
import { useRegisterFormContext } from '@/features/auth/components/RegisterFormContextProvider';

import { useSignUp } from '../services/query';
import { RoleRadioGroup } from './RoleRadioGroup';

export const ProfileForm = () => {
  const {
    profileForm,
    credentialForm,
    termsCheckboxGroup,
    invitationCodeFromLink,
  } = useRegisterFormContext();

  const router = useRouter();

  const { mutate: signUp } = useSignUp();

  const onSubmit = profileForm.handleSubmit(() => {
    signUp(
      {
        email: credentialForm.getValues('email'),
        password: credentialForm.getValues('password'),
        verificationCode: credentialForm.getValues('verificationCode'),
        acceptOptionalTerm:
          termsCheckboxGroup.checkedItems.includes('marketing'),
        name: profileForm.getValues('name'),
        role: profileForm.getValues('role'),
        invitationCode:
          invitationCodeFromLink ?? profileForm.getValues('invitationCode'),
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
      className="mx-auto mt-8 flex max-w-[570px] flex-col gap-8 px-4"
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
      <Form.Item error={!!profileForm.formState.errors.invitationCode}>
        <Form.Label>선생님 초대 코드</Form.Label>
        <Form.Control>
          <Input
            {...profileForm.register('invitationCode')}
            placeholder="티쳐백"
            readOnly={!!invitationCodeFromLink}
          />
        </Form.Control>
      </Form.Item>
      <Button type="submit">가입 완료</Button>
    </Form>
  );
};
