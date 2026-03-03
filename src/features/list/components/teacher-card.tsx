'use client';

import { IoIosArrowForward } from 'react-icons/io';

import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/shared/lib';

import { PublicTeacherProfile } from '../types/teacher.types';
import { TeacherInfoBlock } from './teacher-info-block';

interface TeacherCardProps {
  teacher: PublicTeacherProfile;
}

export const TeacherCard = ({ teacher }: TeacherCardProps) => {
  const teacherImg = teacher.id % 2 === 0 ? '1' : '2';

  return (
    <Link
      href={`/profile/${teacher.id}`}
      className={cn(
        'group border-gray-3 relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border bg-white p-4 transition-all duration-300 md:p-6',
        'hover:scale-105 hover:shadow-xl'
      )}
    >
      <div className="border-gray-12 relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full border bg-gray-50 p-1 md:h-[100px] md:w-[100px]">
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

      {/* 정보 영역 */}
      <TeacherInfoBlock
        teacherName={teacher.name}
        showNewBadge={teacher.isNewTeacher}
        className="flex-1 gap-1"
        showDivider
        footer={
          <div className="group-hover:text-orange-7 text-gray-10 mt-1 flex items-center justify-end text-[14px] transition-colors md:text-[14px]">
            프로필 바로가기
            <IoIosArrowForward className="ml-1 h-[16px] w-[16px]" />
          </div>
        }
      />
    </Link>
  );
};
