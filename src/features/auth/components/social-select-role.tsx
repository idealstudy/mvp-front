'use client';

import { useForm } from 'react-hook-form';

import { useRouter, useSearchParams } from 'next/navigation';

import { ProfileForm } from '@/features/auth/components/profile-form';
import { SocialRegisterForm } from '@/features/auth/schemas/social-register';
import { useUpdateProfile } from '@/features/auth/services/query';
import { INVITE_VISITED_KEY } from '@/features/invite/constants';
import { useAcceptInvitation } from '@/features/invite/hooks';
import { useSession } from '@/providers';
import { Form } from '@/shared/components/ui';
import { PUBLIC } from '@/shared/constants';
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
      role: 'ROLE_TEACHER',
      name: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    updateProfile(data, {
      onSuccess: async () => {
        await session.refresh();
        if (inviteToken) {
          if (data.role === 'ROLE_STUDENT') {
            sessionStorage.setItem(INVITE_VISITED_KEY, Date.now().toString());
            acceptInvitation(inviteToken);
          } else {
            router.push(PUBLIC.CORE.INVITE.ERROR('ROLE_NOT_MATCH'));
          }
        } else {
          router.push('/dashboard');
        }
      },
      onError: () => {
        alert('프로필 완성에 실패했습니다. 다시 시도해주세요.');
      },
    });
  });

  return (
    <Form onSubmit={handleSubmit}>
      <ProfileForm
        form={form}
        buttonText={isPending ? '처리 중...' : '프로필 완성'}
      />
    </Form>
  );
};
