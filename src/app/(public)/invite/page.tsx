'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { InviteLetter } from '@/features/invite/components/invite-letter';
import { InviteLoginModal } from '@/features/invite/components/invite-login-modal';

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const inviteToken = searchParams.get('token');

  useEffect(() => {
    if (!inviteToken) {
      router.replace('/');
    }
  }, [inviteToken, router]);

  if (!inviteToken) {
    return null;
  }

  return (
    <main className="bg-gray-white tablet:pt-32.5 desktop:pt-15 mx-auto flex h-[calc(100vh-var(--spacing-header-height))] w-full justify-center pt-25">
      <InviteLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        inviteToken={inviteToken}
      />
      <InviteLetter
        teacherName="John Doe"
        studyRoomName="Study Room"
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />
    </main>
  );
}
