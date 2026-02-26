'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { mockStudyRoomDetail } from '../../mocks/mocks-data';
import { InfoItem } from './contents-info-item';

export const StudyroomPreviewContents = () => {
  const data = mockStudyRoomDetail;

  const [visibleData, setVisibleData] = useState(3);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const reviews = data.reviews.slice(0, visibleData);

  // 무한 스크롤
  // TODO : api 생기면 tanstack query 변경 예정
  useEffect(() => {
    const node = loadMoreRef.current;

    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleData((prev) =>
            prev + 3 > data.reviews.length ? data.reviews.length : prev + 3
          );
        }
      },
      {
        root: null,
        threshold: 1,
      }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, [data.reviews.length]);

  return (
    <section className="flex w-full flex-col gap-6">
      <article className="bg-system-background-alt flex flex-col gap-4 rounded-xl p-6">
        <header className="flex flex-col gap-1">
          <p className="font-body1-heading tablet:font-headline1-heading desktop:font-title-heading text-text-main">
            스터디룸 소개
          </p>
          <p className="font-caption-normal tablet:font-body2-normal text-text-sub1">
            선생님이 직접 작성한 스터디룸 소개글이에요.
          </p>
        </header>
        <p className="font-body2-normal text-gray-scale-gray-95 break-keep">
          {data.introduction.description}
        </p>
      </article>

      <article className="bg-system-background-alt flex flex-col gap-4 rounded-xl p-6">
        <p className="font-body1-heading tablet:font-headline1-heading text-text-main">
          스터디룸 운영 방식
        </p>
        <div>
          <div className="tablet:flex-row tablet:items-stretch tablet:gap-5 flex flex-col gap-4">
            <InfoItem
              icon="/public-studyrooms/ic_books.png"
              alt="subject"
              label="과목"
              value={data.operationInfo.subject}
            />

            <div className="tablet:block hidden w-px self-stretch bg-gray-200" />

            <InfoItem
              icon="/public-studyrooms/ic_person.png"
              alt="target"
              label="수업 대상"
              value={data.operationInfo.target}
            />

            <div className="tablet:block hidden w-px self-stretch bg-gray-200" />

            <InfoItem
              icon="/public-studyrooms/ic_book.png"
              alt="class-type"
              label="수업 방식"
              value={data.operationInfo.classSize}
            />
          </div>
        </div>
      </article>

      {/* 후기 */}
      <article className="bg-system-background-alt flex flex-col gap-4 rounded-xl p-6">
        <header className="flex flex-col gap-1">
          <p className="font-body1-heading tablet:font-headline1-heading text-text-main">
            스터디룸 후기
          </p>
          <p className="font-caption-normal tablet:font-body2-normal text-text-sub1">
            실제 스터디룸 참여 학생과 보호자들의 후기예요.
          </p>
        </header>

        {/* 키워드 / 후기 개수 */}
        <div className="desktop:flex-row desktop:items-center desktop:justify-between flex flex-col gap-3">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <div className="font-label-heading bg-orange-2 text-orange-7 rounded-xl px-4 py-2">
              #친절해요
            </div>
            <div className="font-label-heading bg-orange-2 text-orange-7 rounded-xl px-4 py-2">
              #피드백빠름
            </div>
            <div className="font-label-heading bg-orange-2 text-orange-7 rounded-xl px-4 py-2">
              #체계적수업
            </div>
          </div>
          <div>
            <p className="font-label-normal text-orange-7">
              {data.reviews.length}개의 후기
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pr-2">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-gray-3 bg-system-background-alt flex flex-col gap-3 rounded-lg border p-4"
            >
              {/* 상단 영역 */}
              <div className="flex items-start gap-3">
                {/* 프로필 */}
                <Image
                  src="/character/img_profile_student01.png"
                  alt="student"
                  width={36}
                  height={36}
                  className="border-gray-12 h-9 w-9 rounded-full border object-cover p-0.5"
                />

                {/* 오른쪽 전체 */}
                <div className="flex flex-1 flex-col gap-1">
                  {/* 1줄: 이름 + 상대시간 */}
                  <div className="flex items-center justify-between">
                    <p className="font-body2-normal text-text-main">
                      {review.author.name}
                    </p>
                    <p className="font-caption-normal text-gray-7">2분 전</p>
                  </div>

                  {/* 2줄: 역할 + 날짜 */}
                  <div className="flex items-center gap-2">
                    <p className="font-caption-normal text-orange-7">학생</p>
                    <p className="font-caption-normal text-gray-12">
                      {review.createdAt}
                    </p>
                  </div>
                </div>
              </div>

              {/* 후기 내용 */}
              <p className="font-label-normal text-text-sub1 break-keep">
                {review.content}
              </p>
            </div>
          ))}
          <div
            ref={loadMoreRef}
            className="h-1"
          />
        </div>
      </article>
    </section>
  );
};
