import { notFound } from 'next/navigation';

import ColumnWriteArea from '@/features/community/column/components/column-write-area';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ColumnEditPage({ params }: Props) {
  const { id } = await params;
  const columnId = Number(id);

  if (isNaN(columnId)) notFound();

  return (
    <ColumnWriteArea
      id={columnId}
      isEditMode
    />
  );
}
