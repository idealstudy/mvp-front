'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  CLASS_FORM_TO_KOREAN,
  ENROLLMENT_STATUS_TO_KOREAN,
  MODALITY_TO_KOREAN,
  SCHOOL_LEVEL_TO_KOREAN,
  SUBJECT_TO_KOREAN,
} from '@/entities/study-room-preview/core/preview.domain';
import { cn } from '@/shared/lib';
import { trackDedu101StudyroomFeatureClick } from '@/shared/lib/analytics';
import { useMemberStore } from '@/store';

import { PublicStudyRoom } from '../types/teacher.types';

interface StudyRoomCardProps {
  studyRoom: PublicStudyRoom;
}

export const StudyRoomCard = ({ studyRoom }: StudyRoomCardProps) => {
  const role = useMemberStore((s) => s.member?.role ?? null);

  const handleStudyRoomClick = () => {
    trackDedu101StudyroomFeatureClick(
      {
        room_id: studyRoom.id,
        feature_type: 'subject',
        feature_value: studyRoom.subjectType ?? 'unknown',
      },
      role
    );
  };

  const subjectText = studyRoom.subjectType
    ? SUBJECT_TO_KOREAN[studyRoom.subjectType]
    : '기타';

  const targetText = studyRoom.schoolInfo?.grade
    ? `${SCHOOL_LEVEL_TO_KOREAN[studyRoom.schoolInfo.schoolLevel ?? 'OTHER']} ${studyRoom.schoolInfo.grade}학년`
    : studyRoom.schoolInfo?.schoolLevel
      ? SCHOOL_LEVEL_TO_KOREAN[studyRoom.schoolInfo.schoolLevel]
      : '대상 미정';

  const classStyleText =
    studyRoom.modality && studyRoom.classForm
      ? `${MODALITY_TO_KOREAN[studyRoom.modality]} · ${CLASS_FORM_TO_KOREAN[studyRoom.classForm]} 수업`
      : '수업 방식 미정';

  const enrollmentStatusText = studyRoom.enrollmentStatus
    ? ENROLLMENT_STATUS_TO_KOREAN[studyRoom.enrollmentStatus]
    : '모집 중';

  return (
    <Link
      href={`/study-room-preview/${studyRoom.id}/${studyRoom.teacherId}`}
      className={cn(
        'border-gray-scale-gray-10 relative block overflow-hidden rounded-2xl border-[1.5px] bg-white',
        'group transition-all duration-300 hover:scale-105 hover:shadow-xl'
      )}
      onClick={handleStudyRoomClick}
    >
      {/* 기존 카드 */}
      <div className="transition-opacity duration-300 group-hover:opacity-0">
        {/* 상단 영역 */}
        <div
          className={cn(
            'relative h-[150px] overflow-hidden',
            studyRoom.thumbnailUrl ? '' : 'bg-orange-1'
          )}
        >
          <Image
            src={studyRoom.thumbnailUrl || '/studyroom/profile.svg'}
            width={440}
            height={150}
            alt="스터디룸 프리뷰 기본 이미지"
            className="max-h-[150px] object-contain"
          />
          {/* 모집 상태 */}
          <span className="bg-gray-black/40 font-label-heading text-gray-white absolute top-4 left-4 rounded-lg px-2.5 py-1">
            {enrollmentStatusText}
          </span>
        </div>
        {/* 하단 영역 */}
        <div className="border-line-line1 items-center space-y-2 border-t bg-white p-5 pt-4">
          <p className="font-body1-heading">{studyRoom.name}</p>
          <div className="flex items-center gap-2">
            <Image
              src="/character/img_profile_teacher01.png"
              width={32}
              height={32}
              alt={`${studyRoom.teacherName} 선생님 프로필 이미지`}
              className="border-line-line1 aspect-square rounded-full border object-cover"
            />
            <span className="font-label-normal">
              {studyRoom.teacherName} 선생님
            </span>
            <span className="bg-orange-2 text-orange-7 font-caption-heading rounded-sm px-2 py-1">
              {subjectText}
            </span>
          </div>
        </div>
      </div>

      {/* 호버 카드 (상세 내용) */}
      <div className="absolute inset-0 flex flex-col justify-between bg-white p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="space-y-2">
          <p className="font-body1-heading">{studyRoom.name}</p>
          <p className="line-clamp-3">{studyRoom.description}</p>
        </div>
        <hr className="border-gray-3 border" />

        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <Image
              src="/study-room-preview/ic-person.png"
              alt="수업 대상"
              width={21}
              height={18}
              className="object-contain"
            />
            <p className="font-label-heading text-gray-12">{targetText}</p>
          </div>

          <div className="flex items-center gap-2">
            <Image
              src="/study-room-preview/ic-books.png"
              alt="과목"
              width={21}
              height={18}
              className="object-contain"
            />
            <p className="font-label-heading text-gray-12">{subjectText}</p>
          </div>

          <div className="flex items-center gap-2">
            <Image
              src="/study-room-preview/ic-book.png"
              alt="수업 방식"
              width={21}
              height={18}
              className="object-contain"
            />
            <p className="font-label-heading text-gray-12">{classStyleText}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
