'use client';

import Image from 'next/image';
import Link from 'next/link';

import { PUBLIC } from '@/shared/constants';
import { cn } from '@/shared/lib';
import { trackDedu101TeacherClick } from '@/shared/lib/analytics';
import { useMemberStore } from '@/store';

import { PublicTeacherProfile } from '../types/teacher.types';

const MAX_VISIBLE_TAGS = 2;

interface TeacherCardProps {
  teacher: PublicTeacherProfile;
  cardIndex: number;
  sort: 'LATEST' | 'OLDEST' | 'ALPHABETICAL';
  subject?: string;
}

export const TeacherCard = ({
  teacher,
  cardIndex,
  sort,
  subject,
}: TeacherCardProps) => {
  // TODO 프로필 이미지 연결
  const teacherImg = teacher.id % 2 === 0 ? '1' : '2';
  const role = useMemberStore((s) => s.member?.role ?? null);

  const visibleTags = teacher.specialties?.slice(0, MAX_VISIBLE_TAGS) ?? [];
  const extraTagCount = Math.max(
    0,
    (teacher.specialties?.length ?? 0) - MAX_VISIBLE_TAGS
  );

  const stats = [
    { label: '스터디룸', value: teacher.studyRoomCount },
    { label: '학생', value: teacher.studentCount ?? 0 },
    { label: '수업노트', value: teacher.teachingNoteCount ?? 0 },
  ];

  const handleTeacherClick = () => {
    trackDedu101TeacherClick(
      { teacher_id: teacher.id, card_index: cardIndex, sort, subject },
      role
    );
  };

  return (
    <Link
      href={PUBLIC.PROFILE.TEACHER(teacher.id)}
      className={cn(
        'group border-gray-3 flex w-full flex-col gap-3 overflow-hidden rounded-2xl border bg-white p-4 transition-all duration-300',
        'hover:scale-105 hover:shadow-xl'
      )}
      onClick={handleTeacherClick}
    >
      {/* 상단: 프로필 이미지 + 이름/태그 */}
      <div className="flex items-center gap-3">
        <div className="border-gray-3 relative h-16 w-16 shrink-0 overflow-hidden rounded-full border bg-gray-50 p-0.5">
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image
              src={
                teacher.profileImageUrl ??
                `/character/img_profile_teacher0${teacherImg}.png`
              }
              alt={teacher.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="font-body1-heading truncate">
            {teacher.name} 선생님
          </span>
          {visibleTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              {visibleTags.map((tag, i) => (
                <span
                  key={tag}
                  className={cn(
                    'rounded-sm px-2 py-1',
                    i === 0
                      ? 'font-label-heading bg-orange-2 text-orange-7'
                      : 'font-label-normal bg-gray-1 text-gray-7'
                  )}
                >
                  {tag}
                </span>
              ))}
              {extraTagCount > 0 && (
                <span className="font-label-normal bg-gray-1 text-gray-7 rounded-sm px-2 py-1">
                  +{extraTagCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 간단 소개 */}
      {teacher.bio && <p className="line-clamp-2">{teacher.bio}</p>}

      {/* 하단 통계 */}
      <div className="border-gray-3 divide-gray-3 flex divide-x rounded-lg border">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-1 items-center justify-center gap-1 py-2.5"
          >
            <span className="font-caption-heading">{label}</span>
            <span className="font-caption-heading text-orange-6">{value}</span>
          </div>
        ))}
      </div>
    </Link>
  );
};
