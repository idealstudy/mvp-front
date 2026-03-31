'use client';

import { ColumnDetail } from '@/entities/column';
import {
  useColumnDetail,
  useMyColumnDetail,
} from '@/features/community/column/hooks/use-column-detail';
import { TextViewer, parseEditorContent } from '@/shared/components/editor';
import { getRelativeTimeString } from '@/shared/lib';

export default function ColumnDetailView({
  id,
  initialData,
  isPrivate = false,
}: {
  id: number;
  initialData?: ColumnDetail;
  isPrivate?: boolean;
}) {
  const {
    data: publicData,
    isLoading: publicLoading,
    isError: publicError,
  } = useColumnDetail(id, initialData, { enabled: !isPrivate });
  const {
    data: privateData,
    isLoading: privateLoading,
    isError: privateError,
  } = useMyColumnDetail(id, { enabled: isPrivate });

  const data = isPrivate ? privateData : publicData;
  const isLoading = isPrivate ? privateLoading : publicLoading;
  const isError = isPrivate ? privateError : publicError;

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>데이터를 불러올 수 없습니다.</div>;
  if (!data) return null;

  const content = parseEditorContent(data.resolvedContent.content);

  return (
    <article>
      {isPrivate && (
        <div className="bg-gray-1 font-label-normal mb-6 rounded-lg py-3 text-center">
          승인 대기 중인 글입니다.
        </div>
      )}
      <h1 className="font-title-heading mb-4">{data.title}</h1>
      <div className="text-text-sub2 font-label-normal mb-6 flex gap-4">
        <span>{data.authorNickname ?? '알 수 없음'}</span>
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
