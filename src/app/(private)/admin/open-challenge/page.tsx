import { AdminOpenChallengeTable } from '@/features/open-challenge-admin/components/admin-open-challenge-table';

export default function AdminOpenChallengePage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="bg-system-background w-full">
        <div className="mx-auto w-full max-w-[1440px] px-4 pt-8 md:px-8 lg:px-20">
          <h1 className="font-title-heading py-4 text-2xl leading-[135%] tracking-tight lg:text-3xl">
            오픈챌린지 관리
          </h1>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-8 pb-12 md:px-8 lg:px-20">
        <AdminOpenChallengeTable />
      </div>
    </div>
  );
}
