import { InviteErrorContent } from '@/features/invite/components/invite-error-content';
import { type ErrorReason, isErrorReason } from '@/features/invite/types';

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const reasonParam = sp.reason;
  const reason: ErrorReason = isErrorReason(reasonParam as string)
    ? (reasonParam as ErrorReason)
    : 'INVALID_LINK';

  return (
    <main className="bg-gray-white tablet:pt-58 desktop:pt-30 mx-auto flex h-[calc(100vh-var(--spacing-header-height))] w-full justify-center pt-35">
      <InviteErrorContent reason={reason} />
    </main>
  );
}
