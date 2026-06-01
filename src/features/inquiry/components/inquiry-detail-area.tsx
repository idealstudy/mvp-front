'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import InquiryAnswerArea from '@/features/inquiry/components/inquiry-answer-area';
import { useInquiry } from '@/features/inquiry/hooks/use-inquiry';
import { TextViewer, parseEditorContent } from '@/shared/components/editor';
import { MiniSpinner } from '@/shared/components/loading';
import { ProfileAvatar } from '@/shared/components/ui/profile-avatar';
import { DEFAULT_PROFILE_IMAGE } from '@/shared/constants';
import { PUBLIC } from '@/shared/constants';
import { cn } from '@/shared/lib';
import { classifyInquiryError, handleApiError } from '@/shared/lib/errors';
import { useMemberStore } from '@/store';

export default function InquiryDetailArea({ id }: { id: number }) {
  const router = useRouter();
  const { data: inquiry, isLoading, isError, error } = useInquiry(id);
  const memberId = useMemberStore((state) => state.member?.id);
  const isTargetTeacher = memberId === inquiry?.targetTeacherId;

  useEffect(() => {
    if (!isError) return;
    handleApiError(error, classifyInquiryError, {
      // INQUIRY_ACCESS_FORBIDDEN, INQUIRY_NOT_FOUND
      onContext: () => {
        setTimeout(() => {
          router.replace(PUBLIC.CORE.LIST.STUDY_ROOMS);
        }, 1500);
      },
    });
  }, [isError, error, router]);

  if (isLoading)
    return (
      <div className="flex h-40 items-center justify-center">
        <MiniSpinner />
      </div>
    );
  if (isError) return <p>문의를 불러올 수 없습니다.</p>;
  if (!inquiry) return null;

  const content = parseEditorContent(inquiry.resolvedContent.content);

  return (
    <>
      <div className={cn(isTargetTeacher ? 'mr-16' : 'ml-16')}>
        <div className="border-line-line1 mt-4 h-fit w-full rounded-xl border bg-white px-8 py-10">
          {/* 문의 내용 */}
          <div className="flex flex-col gap-5">
            {/* 프로필 */}
            <div className="flex flex-row items-center gap-3">
              <ProfileAvatar
                src={null}
                fallbackSrc={DEFAULT_PROFILE_IMAGE.STUDENT}
                alt={`${inquiry.inquirerName} 프로필`}
                size={40}
                memberId={inquiry.inquirerId}
                role="ROLE_STUDENT"
                className="h-10 w-10"
              />
              <span className="font-body2-heading">{inquiry.inquirerName}</span>
            </div>

            {/* 스터디룸 */}
            {inquiry.studyRoomName && inquiry.studyRoomId && (
              <Link
                href={PUBLIC.STUDY_ROOM_PREVIEW.DETAIL(
                  inquiry.studyRoomId,
                  inquiry.targetTeacherId
                )}
                className="font-body2-normal text-text-sub2 hover:underline"
              >
                {inquiry.studyRoomName}
              </Link>
            )}

            {/* 제목 */}
            <h2 className="font-title-heading">{inquiry.title}</h2>

            {/* 문의 내용 */}
            <TextViewer value={content} />

            {/* 작성 날짜 */}
            <span className="font-caption-normal text-text-sub2 self-end">
              {inquiry.regDate.split('T')[0] + ' 작성'}
            </span>
          </div>
        </div>
      </div>
      {/* 답변 영역 */}
      <div className={cn(isTargetTeacher ? 'ml-16' : 'mr-16')}>
        <InquiryAnswerArea inquiry={inquiry} />
      </div>
    </>
  );
}
