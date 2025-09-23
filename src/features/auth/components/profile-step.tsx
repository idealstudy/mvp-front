'use client';

import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRegisterFormContext } from '@/features/auth/components/register-form-context-provider';

import { RoleRadioGroup } from './role-radio-group';

export const ProfileStep = () => {
  const { form } = useRegisterFormContext();

  return (
    <div className="flex flex-col gap-8">
      <Form.Item>
        <Form.Label>사용 유형</Form.Label>
        <Form.Control>
          <Controller
            name="role"
            control={form.control}
            render={({ field }) => <RoleRadioGroup {...field} />}
          />
        </Form.Control>
      </Form.Item>
      <Form.Item error={!!form.formState.errors.name}>
        <Form.Label>이름</Form.Label>
        <Form.Control>
          <Input
            placeholder="수업에 사용할 실명"
            {...form.register('name')}
          />
        </Form.Control>
        <Form.ErrorMessage>
          {form.formState.errors.name?.message}
        </Form.ErrorMessage>
      </Form.Item>
      <Button
        size="large"
        type="submit"
      >
        가입 완료
      </Button>
    </div>
  );
};
