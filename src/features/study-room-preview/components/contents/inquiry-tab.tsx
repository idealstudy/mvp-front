'use client';

import { FormEvent, useRef, useState, useTransition } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import InquiryItem from '@/features/study-room-preview/components/contents/inquiry-item';
import InquiryNotice from '@/features/study-room-preview/components/contents/inquiry-notice';
import { usePreviewInquiries } from '@/features/study-room-preview/hooks/use-preview';
import { MiniSpinner } from '@/shared/components/loading';
import { Button, Input, Pagination } from '@/shared/components/ui';
import { PUBLIC } from '@/shared/constants';
import { cn } from '@/shared/lib';
import { useMemberStore } from '@/store';

// inquiry-tab.tsx의 PAGE_SIZE와 동일하게 유지
const PAGE_SIZE = 20;

const parsePage = (value?: string | null) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
};

export const StudyroomPreviewInquiryTab = ({
  studyRoomId,
  teacherId,
}: {
  studyRoomId: number;
  teacherId: number;
}) => {
  const STORAGE_KEY = `inquiry-draft-${studyRoomId}-${teacherId}-title`;

  const member = useMemberStore((state) => state.member);
  const isTeacher = member?.role === 'ROLE_TEACHER';
  const isOwner = member?.id === teacherId;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const currentPage = parsePage(searchParams.get('page'));
  const { data, isLoading, isError } = usePreviewInquiries(
    studyRoomId,
    currentPage - 1
  );

  // 작성하기 클릭 시, sessionStorage에 저장 후 작성 페이지로 이동
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? '';
    if (value) sessionStorage.setItem(STORAGE_KEY, value);
    setIsNavigating(true);
    router.push(PUBLIC.INQUIRY.CREATE(teacherId, studyRoomId));
  };

  // 페이지 이동
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    });
  };

  // 전체 페이지 계산 (api에서 받지 않음)
  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  return (
    <div className="space-y-5">
      {/* 문의 작성하기 */}
      {!isTeacher && (
        <div className="border-line-line1 rounded-tr-xl rounded-b-xl border bg-white p-6">
          <h1 className="font-headline1-heading">
            어떤 내용을 문의하시겠어요?
          </h1>
          <form
            onSubmit={handleSubmit}
            className="mt-9 flex items-center gap-2"
          >
            <Input
              ref={inputRef}
              placeholder="문의 제목을 입력해주세요"
              maxLength={30}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isNavigating}
            >
              {isNavigating ? '이동 중...' : '작성하기'}
            </Button>
          </form>
        </div>
      )}

      {/* 문의 목록 */}
      <div
        className={cn(
          'border-line-line1 rounded-xl border bg-white p-6',
          isTeacher ? 'rounded-tl-none' : ''
        )}
      >
        {/* 문의 공지 */}
        <InquiryNotice isOwner={isOwner} />

        {isLoading && (
          <div className="flex justify-center py-10">
            <MiniSpinner />
          </div>
        )}
        {isError && (
          <p className="text-gray-5 py-10 text-center text-sm">
            문의 목록을 불러올 수 없습니다.
          </p>
        )}
        {data && data.inquiries.length === 0 && (
          <p className="text-gray-5 py-10 text-center text-sm">
            등록된 문의가 없습니다.
          </p>
        )}
        {data && data.inquiries.length > 0 && (
          <>
            <ul className="flex flex-col gap-1">
              {data.inquiries.map((item) => (
                <InquiryItem
                  key={item.id}
                  item={item}
                />
              ))}
            </ul>

            <Pagination
              className="mt-6 justify-center"
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};
