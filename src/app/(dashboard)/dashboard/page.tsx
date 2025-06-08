import { EmptyConnectionDialog } from '@/features/dashboard/connect/components/empty-connection-dialog';

export default function HomePage() {
  return (
    <>
      <main className="mx-auto max-w-[570px] px-4 pb-[180px]"></main>
      <EmptyConnectionDialog />
    </>
  );
}
