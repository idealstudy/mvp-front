import { cache } from 'react';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SITE_CONFIG } from '@/config/site';
import { repository } from '@/entities/column';
import ColumnDetailView from '@/features/community/column/components/column-detail-view';
import { generateColumnDetailMetadata } from '@/features/community/column/metadata';
import BackLink from '@/features/dashboard/studynote/components/back-link';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preview?: string }>;
};

const getDetail = cache((id: number) => repository.getColumnDetail(id));

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const { preview } = await searchParams;

  if (preview === 'true') return { title: SITE_CONFIG.name };

  try {
    const columnDetail = await getDetail(Number(id));
    return generateColumnDetailMetadata(columnDetail);
  } catch {
    return { title: SITE_CONFIG.name };
  }
}

export default async function ColumnDetailPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  // preview: 승인 대기 상태인 글 상세 보기 (본인만 조회 가능)
  const { preview } = await searchParams;
  const columnId = Number(id);
  const isPrivate = preview === 'true';

  if (isNaN(columnId)) notFound();

  try {
    const data = isPrivate ? undefined : await getDetail(columnId);

    return (
      <div className="mx-auto max-w-[1440px] pt-8 pb-20 lg:px-20">
        <BackLink />
        <div className="border-line-line1 mt-4 h-fit w-full rounded-xl border bg-white px-8 py-10">
          <ColumnDetailView
            id={columnId}
            initialData={data}
            isPrivate={isPrivate}
          />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
