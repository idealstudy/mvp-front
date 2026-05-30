import { AdminOpenChallengeEditClient } from '@/features/open-challenge-admin/components/admin-open-challenge-edit-client';

type AdminOpenChallengeEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOpenChallengeEditPage({
  params,
}: AdminOpenChallengeEditPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto w-full max-w-[1120px] px-4 py-8 md:px-8 lg:px-20">
        <AdminOpenChallengeEditClient id={id} />
      </div>
    </div>
  );
}
