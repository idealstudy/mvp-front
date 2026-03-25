import { cache } from 'react';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SITE_CONFIG } from '@/config/site';
import { repository } from '@/entities/column';
import ColumnDetailView from '@/features/community/column/components/column-detail-view';
import BackLink from '@/features/dashboard/studynote/components/back-link';

type Props = {
  params: Promise<{ id: string }>;
};

const getDetail = cache((id: number) => repository.getColumnDetail(id));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getDetail(Number(id));
    return {
      title: `${SITE_CONFIG.name} | ${data.title}`,
      description: data.authorNickname,
      openGraph: {
        title: data.title,
        images: data.thumbnailUrl ? [{ url: data.thumbnailUrl }] : [],
      },
    };
  } catch {
    return { title: SITE_CONFIG.name };
  }
}

export default async function ColumnDetailPage({ params }: Props) {
  const { id } = await params;
  const columnId = Number(id);

  if (isNaN(columnId)) notFound();

  try {
    const data = await getDetail(columnId);

    return (
      <div className="mx-auto max-w-[1440px] pt-8 pb-20 lg:px-20">
        <BackLink />
        <div className="border-line-line1 mt-4 h-fit w-full rounded-xl border bg-white px-8 py-10">
          <ColumnDetailView
            id={columnId}
            initialData={data}
          />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
