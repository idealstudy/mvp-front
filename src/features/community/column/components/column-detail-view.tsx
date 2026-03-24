'use client';

import { ColumnDetail } from '@/entities/column';
import { useColumnDetail } from '@/features/community/column/hooks/use-column-detail';
import { TextViewer, parseEditorContent } from '@/shared/components/editor';
import { getRelativeTimeString } from '@/shared/lib';

export default function ColumnDetailView({
  id,
  initialData,
}: {
  id: number;
  initialData?: ColumnDetail;
}) {
  const { data, isLoading, isError } = useColumnDetail(id, initialData);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>데이터를 불러올 수 없습니다.</div>;
  if (!data) return null;

  const content = parseEditorContent(data.resolvedContent.content);

  return (
    <article>
      <h1 className="font-title-heading mb-4">{data.title}</h1>
      <div className="text-text-sub2 font-label-normal mb-6 flex gap-4">
        <span>{data.authorNickname}</span>
        <span>{getRelativeTimeString(data.regDate)}</span>
        <span>조회 {data.viewCount}</span>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {data.tags.map((tag) => (
          <span
            key={tag}
            className="bg-orange-2 font-label-normal rounded-lg px-3 py-1"
          >
            # {tag}
          </span>
        ))}
      </div>
      <TextViewer value={content} />
    </article>
  );
}
