'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { InviteLetter } from '@/features/invite/components/invite-letter';
import { InviteLoginModal } from '@/features/invite/components/invite-login-modal';
import { INVITE_VISITED_KEY } from '@/features/invite/constants';
import { useInvitation } from '@/features/invite/hooks';
import { PUBLIC } from '@/shared/constants';

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const inviteToken = searchParams.get('token');
  const { data, isLoading, error } = useInvitation(inviteToken);

  useEffect(() => {
    if (!inviteToken) {
      router.replace('/');
      return;
    }
    sessionStorage.setItem(INVITE_VISITED_KEY, Date.now().toString());
  }, [inviteToken, router]);

  useEffect(() => {
    if (!error) return;
    if (error.code === 'INVITATION_EXPIRED') {
      router.push(PUBLIC.CORE.INVITE.ERROR('EXPIRED_LINK'));
    } else {
      router.push(PUBLIC.CORE.INVITE.ERROR('INVALID_LINK'));
    }
  }, [error, router]);

  if (!inviteToken) {
    return null;
  }

  return (
    <main className="bg-gray-white mx-auto flex h-[calc(100vh-var(--spacing-header-height))] w-full items-center justify-center">
      <InviteLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        inviteToken={inviteToken}
      />
      <InviteLetter
        data={data}
        isLoading={isLoading}
        token={inviteToken}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />
    </main>
  );
}
