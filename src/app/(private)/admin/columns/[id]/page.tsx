import { notFound } from 'next/navigation';

import AdminColumnDetailView from '@/features/community/column/components/admin-column-detail-view';
import BackLink from '@/features/dashboard/studynote/components/back-link';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminColumnDetailPage({
  params,
  searchParams,
}: Props) {
  const { status } = await searchParams;
  const { id } = await params;
  const columnId = Number(id);

  if (isNaN(columnId)) notFound();

  return (
    <div className="mx-auto max-w-[1440px] pt-8 pb-20 lg:px-20">
      <BackLink />
      <div className="border-line-line1 mt-4 h-fit w-full rounded-xl border bg-white px-8 py-10">
        <AdminColumnDetailView
          id={columnId}
          status={status}
        />
      </div>
    </div>
  );
}
