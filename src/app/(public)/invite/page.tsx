import { InviteLetter } from '@/features/invite/components/invite-letter';

export default function InvitePage() {
  return (
    <main className="bg-gray-white tablet:pt-32.5 desktop:pt-15 mx-auto flex h-[calc(100vh-var(--spacing-header-height))] w-full justify-center pt-25">
      <InviteLetter
        teacherName="John Doe"
        studyRoomName="Study Room"
      />
    </main>
  );
}
