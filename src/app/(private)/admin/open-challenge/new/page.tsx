import { AdminOpenChallengeForm } from '@/features/open-challenge-admin/components/admin-open-challenge-form';

export default function AdminOpenChallengeNewPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto w-full max-w-[1120px] px-4 py-8 md:px-8 lg:px-20">
        <AdminOpenChallengeForm />
      </div>
    </div>
  );
}
