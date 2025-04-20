'use client';

import { useRouter } from 'next/navigation';

import { useRegisterFormContext } from '@/features/auth/components/RegisterFormContextProvider';

export const ProfileForm = () => {
  const { profileForm: form, invitationCodeFromLink } =
    useRegisterFormContext();

  const router = useRouter();

  const onSubmit = form.handleSubmit(() => {
    router.push('/');
  });

  return (
    <form
      className="flex flex-col"
      onSubmit={onSubmit}
    >
      <input placeholder="수업에 사용할 실명" />
      <input
        {...form.register('invitationCode')}
        placeholder="티쳐백"
        readOnly={!!invitationCodeFromLink}
      />
      <button type="submit">가입 완료</button>
    </form>
  );
};
