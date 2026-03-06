'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { InviteExitModal } from '@/features/invite/components/invite-exit-modal';
import { InviteLetter } from '@/features/invite/components/invite-letter';
import { InviteLoginModal } from '@/features/invite/components/invite-login-modal';
import { useInvitation } from '@/features/invite/hooks';
import { PRIVATE, PUBLIC } from '@/shared/constants';
import { isAxiosError } from 'axios';

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { member } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const handleReject = () => {
    if (member) {
      router.push(PRIVATE.DASHBOARD.INDEX);
    } else {
      router.push(PUBLIC.CORE.INDEX);
    }
  };

  const inviteToken = searchParams.get('token');
  const { data, isLoading, error } = useInvitation(inviteToken);

  useEffect(() => {
    if (!inviteToken) {
      router.replace('/');
    }
  }, [inviteToken, router]);

  useEffect(() => {
    if (!error) return;
    const code = isAxiosError(error) ? error.response?.data?.code : undefined;
    if (code === 'INVITATION_EXPIRED') {
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
      <InviteExitModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={handleReject}
      />
      <InviteLetter
        data={data}
        isLoading={isLoading}
        token={inviteToken}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenExitModal={() => setIsExitModalOpen(true)}
      />
    </main>
  );
}
