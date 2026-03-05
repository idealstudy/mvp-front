'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { MiniSpinner } from '@/shared/components/loading';
import { cn, getRelativeTimeString } from '@/shared/lib';
import { useMemberStore } from '@/store';

import { usePreviewMainInfo } from '../../hooks/use-preview';
import { PreviewMainSkeleton } from '../preview-skeleton';
import { InfoItem } from './contents-info-item';

type StudyroomPreviewContentsProps = {
  studyRoomId: number;
  teacherId: number;
};

const REVIEW_TAGS = ['#친절해요', '#피드백빠름', '#체계적수업'] as const;
const PENDING_SKELETON_DELAY = 150;

export const StudyroomPreviewContents = ({
  studyRoomId,
  teacherId,
}: StudyroomPreviewContentsProps) => {
  const router = useRouter();
  const { data, isPending, isError } = usePreviewMainInfo(studyRoomId);
  const [showPendingSkeleton, setShowPendingSkeleton] = useState(false);
  const [isEditButtonHovered, setIsEditButtonHovered] = useState(false);

  const member = useMemberStore((s) => s.member);

  const isMyStudyRoom =
    member?.role === 'ROLE_TEACHER' && member.id === teacherId;

  const moveToStudyRoomEditPage = () => {
    router.push(`/study-rooms/${studyRoomId}/edit`);
  };

  useEffect(() => {
    if (!isPending) {
      setShowPendingSkeleton(false);
      return;
    }

    const timer = setTimeout(
      () => setShowPendingSkeleton(true),
      PENDING_SKELETON_DELAY
    );
    return () => clearTimeout(timer);
  }, [isPending]);

  if (isPending && showPendingSkeleton) {
    return <PreviewMainSkeleton />;
  }

  if (isPending) {
    return (
      <div className="flex justify-center py-6">
        <MiniSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="font-label-normal text-gray-7 px-6 py-8">
        데이터를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="font-label-normal text-gray-7 px-6 py-8">
        표시할 정보가 없습니다.
      </div>
    );
  }

  const reviews = data.reviewList ?? [];
  const hasReviews = reviews.length > 0;
  const targetText = data.schoolInfo.grade
    ? `${data.schoolInfo.schoolLevelKorean} ${data.schoolInfo.grade}학년`
    : data.schoolInfo.schoolLevelKorean;
  const classStyle = `${data.modalityKorean} · ${data.classFormKorean} 수업`;

  return (
    <section className="flex w-full flex-col gap-6">
      <article className="bg-system-background-alt flex flex-col gap-4 rounded-xl p-6">
        {isMyStudyRoom && (
          <button
            type="button"
            className={cn(
              'group text-gray-12 border-gray-5 font-label-normal flex h-8.5 w-[107px] cursor-pointer items-center justify-center gap-1 self-end rounded-md border px-2.5 py-1.5 whitespace-nowrap',
              'hover:border-orange-7 hover:text-orange-7 transition'
            )}
            onClick={moveToStudyRoomEditPage}
            onMouseEnter={() => setIsEditButtonHovered(true)}
            onMouseLeave={() => setIsEditButtonHovered(false)}
          >
            <Image
              src={'/study-room-preview/ic-pencil.png'}
              alt="modify"
              width={24}
              height={24}
              className="transition"
              style={{
                filter: isEditButtonHovered
                  ? 'invert(45%) sepia(64%) saturate(1738%) hue-rotate(352deg) brightness(99%) contrast(97%)'
                  : 'none',
              }}
            />
            수정하기
          </button>
        )}
        <header className="flex flex-col gap-1">
          <p className="font-body1-heading tablet:font-headline1-heading desktop:font-title-heading text-text-main">
            스터디룸 소개
          </p>
          <p className="font-caption-normal tablet:font-body2-normal text-text-sub1">
            선생님이 직접 작성한 스터디룸 소개글이에요.
          </p>
        </header>
        <p className="font-body2-normal text-gray-scale-gray-95 break-keep">
          {data.description || '선생님이 작성한 소개글이 아직 없어요.'}
        </p>
      </article>

      {!data.characteristic && isMyStudyRoom && (
        <article className="bg-system-background-alt flex flex-col gap-4 rounded-xl p-6">
          <p className="font-body1-heading tablet:font-headline1-heading text-text-main">
            스터디룸 특징
          </p>
          <p className="font-caption-normal tablet:font-body2-normal text-text-sub1">
            선생님이 강조한 스터디룸의 특징이에요.
          </p>

          <div className="flex flex-col items-center justify-center gap-1">
            <p className="font-body2-normal text-gray-5">
              아직 작성된 스터디룸 특징이 없어요.
            </p>
            <button
              className={cn(
                'font-body2-normal border-orange-7 text-orange-7 flex h-8.5 w-[107px] cursor-pointer items-center justify-center rounded-md border',
                'hover:bg-orange-7/10 transition'
              )}
              onClick={moveToStudyRoomEditPage}
            >
              작성하러 가기
            </button>
          </div>
        </article>
      )}

      <article className="bg-system-background-alt flex flex-col gap-4 rounded-xl p-6">
        <p className="font-body1-heading tablet:font-headline1-heading text-text-main">
          스터디룸 운영 방식
        </p>
        <div className="tablet:flex-row tablet:items-stretch tablet:gap-5 flex flex-col gap-4">
          <InfoItem
            icon="/study-room-preview/ic-books.png"
            alt="subject"
            label="과목"
            value={data.subjectTypeKorean}
          />

          <div className="tablet:block bg-gray-3 hidden w-px self-stretch" />

          <InfoItem
            icon="/study-room-preview/ic-person.png"
            alt="target"
            label="수업 대상"
            value={targetText}
          />

          <div className="tablet:block hidden w-px self-stretch bg-gray-200" />

          <InfoItem
            icon="/study-room-preview/ic-book.png"
            alt="class-type"
            label="수업 방식"
            value={classStyle}
          />
        </div>
      </article>

      <article className="bg-system-background-alt flex flex-col gap-4 rounded-xl p-6">
        <header className="flex flex-col gap-1">
          <p className="font-body1-heading tablet:font-headline1-heading text-text-main">
            스터디룸 후기
          </p>
          <p className="font-caption-normal tablet:font-body2-normal text-text-sub1">
            실제 스터디룸 참여 학생과 보호자들의 후기예요.
          </p>
        </header>

        {hasReviews ? (
          <>
            <div className="desktop:flex-row desktop:items-center desktop:justify-between flex flex-col gap-3">
              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                {REVIEW_TAGS.map((tag) => (
                  <div
                    key={tag}
                    className="font-label-heading bg-orange-2 text-orange-7 rounded-xl px-4 py-2"
                  >
                    {tag}
                  </div>
                ))}
              </div>
              <p className="font-label-normal text-orange-7">
                {reviews.length}개의 후기
              </p>
            </div>

            <div className="flex flex-col gap-3 pr-2">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-gray-3 bg-system-background-alt flex flex-col gap-3 rounded-lg border p-4"
                >
                  <div className="flex items-start gap-3">
                    <Image
                      src="/character/img_profile_student01.png"
                      alt="student"
                      width={36}
                      height={36}
                      className="border-gray-12 h-9 w-9 rounded-full border object-cover p-0.5"
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <p className="font-body2-normal text-text-main">
                          {review.srcMemberName}
                        </p>
                        <p className="font-caption-normal text-gray-7">
                          {getRelativeTimeString(review.regDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-caption-normal text-orange-7">
                          학생
                        </p>
                        <p className="font-caption-normal text-gray-12">
                          {review.startDate}부터 수업 중
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="font-label-normal text-text-sub1 break-keep">
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="font-label-normal text-gray-7">
            아직 작성된 후기가 없습니다.
          </p>
        )}
      </article>
    </section>
  );
};
