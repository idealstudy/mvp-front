'use client';

import { useState } from 'react';
import { Controller } from 'react-hook-form';

import { useRegisterFormContext } from '@/features/auth/components/register-form-context-provider';
import { PHONE_REGEX } from '@/features/auth/schemas/register';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { trackAuthSignupClick } from '@/shared/lib/analytics';
import axios from 'axios';

import { useCheckPhoneNumberDuplicate } from '../services/query';
import { RoleRadioGroup } from './role-radio-group';

// 전화번호 자동 하이픈 포맷팅
const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

export const ProfileStep = () => {
  const [isPhoneNumberChecked, setIsPhoneNumberChecked] = useState(false);

  const { form } = useRegisterFormContext();

  const {
    mutate: checkPhoneNumberDuplicate,
    isPending: isCheckingPhoneNumberDuplicate,
  } = useCheckPhoneNumberDuplicate();

  // 전화번호 유효성 검사
  const phoneNumberValue = form.watch('phoneNumber');
  const isPhoneNumberValid = PHONE_REGEX.test(phoneNumberValue);

  // 전화번호 중복 검사
  const onCheckPhoneNumberButtonClick = () => {
    if (isCheckingPhoneNumberDuplicate) return;

    checkPhoneNumberDuplicate(
      { phoneNumber: form.getValues('phoneNumber').replace(/-/g, '') },
      {
        onSuccess: () => {
          setIsPhoneNumberChecked(true);
          form.clearErrors('phoneNumber');
        },
        onError: (error) => {
          if (
            axios.isAxiosError(error) &&
            error.response?.data?.code === 'PHONE_NUMBER_ALREADY_EXIST'
          ) {
            form.setError('phoneNumber', {
              message: '이미 사용 중인 전화번호입니다.',
            });
          } else {
            form.setError('phoneNumber', {
              message: '전화번호 확인 중 오류가 발생했습니다.',
            });
          }
          setIsPhoneNumberChecked(false);
        },
      }
    );
  };

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
      <Form.Item error={!!form.formState.errors.phoneNumber}>
        <Form.Label>전화번호</Form.Label>
        <div className="flex">
          <Controller
            name="phoneNumber"
            control={form.control}
            render={({ field }) => (
              <Input
                className="rounded-r-none border-r-0"
                placeholder="010-0000-0000"
                value={field.value}
                onChange={(e) => {
                  field.onChange(formatPhoneNumber(e.target.value));
                  setIsPhoneNumberChecked(false);
                  form.clearErrors('phoneNumber');
                }}
              />
            )}
          />
          <Button
            variant="secondary"
            className="h-[56px] rounded-l-none"
            type="button"
            onClick={onCheckPhoneNumberButtonClick}
            disabled={
              isPhoneNumberChecked ||
              !isPhoneNumberValid ||
              isCheckingPhoneNumberDuplicate
            }
          >
            중복 확인
          </Button>
        </div>
        <Form.ErrorMessage>
          {form.formState.errors.phoneNumber?.message}
        </Form.ErrorMessage>
      </Form.Item>
      <Button
        size="large"
        type="submit"
        disabled={!isPhoneNumberChecked}
        onClick={trackAuthSignupClick}
      >
        가입 완료
      </Button>
    </div>
  );
};
