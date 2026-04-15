'use client';

import { useForm } from 'react-hook-form';

import { useRouter, useSearchParams } from 'next/navigation';

import { ProfileForm } from '@/features/auth/components/profile-form';
import { SocialRegisterForm } from '@/features/auth/schemas/social-register';
import { useUpdateProfile } from '@/features/auth/services/query';
import { useAcceptInvitation } from '@/features/invite/hooks';
import { useSession } from '@/providers';
import { Form } from '@/shared/components/ui';
import { PUBLIC } from '@/shared/constants';
import {
  trackAuthSignupFail,
  trackAuthSignupSuccess,
} from '@/shared/lib/analytics';
import { zodResolver } from '@hookform/resolvers/zod';

export const SocialSelectRole = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('token');
  const session = useSession();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { acceptInvitation } = useAcceptInvitation();

  const form = useForm<SocialRegisterForm>({
    resolver: zodResolver(SocialRegisterForm),
    mode: 'onChange',
    defaultValues: {
      role: inviteToken ? 'ROLE_STUDENT' : 'ROLE_TEACHER',
      name: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    updateProfile(data, {
      onSuccess: async () => {
        trackAuthSignupSuccess(data.role, 'kakao');

        await session.refresh();
        if (inviteToken) {
          if (data.role === 'ROLE_STUDENT') {
            acceptInvitation(inviteToken);
          } else {
            router.push(PUBLIC.CORE.INVITE.ERROR('ROLE_NOT_MATCH'));
          }
        } else {
          router.push('/dashboard');
        }
      },
      onError: () => {
        trackAuthSignupFail('kakao');
        alert('프로필 완성에 실패했습니다. 다시 시도해주세요.');
      },
    });
  });

  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="text-gray-black tablet:mt-[117px] tablet:mb-[57px] tablet:text-[32px] mt-[57px] mb-[27px] text-[24px] font-bold">
        <span className="text-orange-7">프로필</span> 만들기
      </h1>
      <ProfileForm
        form={form}
        buttonText={isPending ? '처리 중...' : '프로필 완성'}
      />
    </Form>
  );
};
