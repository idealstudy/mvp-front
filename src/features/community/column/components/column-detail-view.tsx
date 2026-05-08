'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { ColumnDetail } from '@/entities/column';
import {
  useColumnDetail,
  useMyColumnDetail,
  useToggleColumnLike,
} from '@/features/community/column/hooks/use-column-detail';
import { ConfirmDialog } from '@/shared/components/dialog';
import { TextViewer, parseEditorContent } from '@/shared/components/editor';
import { PUBLIC } from '@/shared/constants';
import { getRelativeTimeString } from '@/shared/lib';
import { classifyColumnError, handleApiError } from '@/shared/lib/errors';
import { useMemberStore } from '@/store';
import { Heart } from 'lucide-react';

export default function ColumnDetailView({
  id,
  initialData,
  isPrivate = false,
}: {
  id: number;
  initialData?: ColumnDetail;
  isPrivate?: boolean;
}) {
  const router = useRouter();
  const member = useMemberStore((s) => s.member);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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

  const toggleColumnLikeMutation = useToggleColumnLike(id);

  const data = isPrivate ? privateData : publicData;
  const isLoading = isPrivate ? privateLoading : publicLoading;
  const isError = isPrivate ? privateError : publicError;

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>데이터를 불러올 수 없습니다.</div>;
  if (!data) return null;

  const content = parseEditorContent(data.resolvedContent.content);

  const handleLikeToggle = () => {
    if (!member) {
      setIsLoginModalOpen(true);
      return;
    }

    toggleColumnLikeMutation.mutate(undefined, {
      onError: (error) => {
        handleApiError(error, classifyColumnError, {
          onContext: () => {},
        });
      },
    });
  };

  return (
    <>
      <article>
        {isPrivate && (
          <div className="bg-gray-1 font-label-normal mb-6 rounded-lg py-3 text-center">
            승인 대기 중인 글입니다.
          </div>
        )}
        <h1 className="font-title-heading mb-4">{data.title}</h1>
        <div className="text-text-sub2 font-label-normal mb-6 flex gap-4">
          <span>{data.authorName ?? data.authorNickname ?? '알 수 없음'}</span>
          <span>{getRelativeTimeString(data.regDate)}</span>
          <span>조회 {data.viewCount}</span>
          <span>좋아요 {data.likeCount}</span>
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

        {/* 좋아요 버튼 */}
        {!isPrivate && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleLikeToggle}
              disabled={toggleColumnLikeMutation.isPending}
              className="border-line-line1 hover:bg-background-orange flex cursor-pointer items-center gap-1.5 rounded-full border px-8 py-2 transition-colors"
            >
              <Heart
                size={28}
                className={
                  data.liked === true
                    ? 'fill-orange-5 text-orange-5'
                    : 'text-gray-5'
                }
              />
              <span className="text-gray-5">{data.likeCount}</span>
            </button>
          </div>
        )}
      </article>

      {/* 로그인 이동 안내 Dialog */}
      <ConfirmDialog
        variant="confirm-cancel"
        open={isLoginModalOpen}
        dispatch={(action) => {
          if (action.type === 'CLOSE') setIsLoginModalOpen(false);
        }}
        emphasis="title-strong"
        onConfirm={() => {
          const from = encodeURIComponent(window.location.pathname);
          router.replace(`${PUBLIC.CORE.LOGIN}?from=${from}`);
        }}
        onCancel={() => setIsLoginModalOpen(false)}
        title="로그인이 필요해요"
        description="마음에 든 칼럼에 좋아요를 눌러보세요."
        confirmText="로그인하기"
        cancelText="취소"
      />
    </>
  );
}
