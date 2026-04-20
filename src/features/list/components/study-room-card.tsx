'use client';

import Link from 'next/link';

import { cn } from '@/shared/lib';
import { trackDedu101StudyroomFeatureClick } from '@/shared/lib/gtm/trackers';
import { useMemberStore } from '@/store';

import { PublicStudyRoom } from '../types/teacher.types';
import { TeacherInfoBlock } from './teacher-info-block';

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

  return (
    <Link
      href={`/study-room-preview/${studyRoom.id}/${studyRoom.teacherId}`}
      className={cn(
        'border-gray-scale-gray-10 block overflow-hidden rounded-2xl border-[1.5px] bg-white transition-all duration-300',
        'hover:scale-105 hover:shadow-xl'
      )}
      onClick={handleStudyRoomClick}
    >
      {/* 상단 영역 */}
      <div className="bg-orange-1 flex flex-col gap-[10px] p-6">
        <h3 className="font-body1-heading text-gray-12 line-clamp-1">
          {studyRoom.name}
        </h3>
        <p className="font-body2-normal text-gray-10 line-clamp-2 min-h-[66px]">
          {studyRoom.description}
        </p>
      </div>

      {/* 하단 영역 */}
      <div className="border-gray-scale-gray-10 border-t-1 bg-white p-6">
        <TeacherInfoBlock
          teacherName={studyRoom.teacherName}
          // showNewBadge
          subjectLabel={studyRoom.subjectType ?? '영어'}
        />
      </div>
    </Link>
  );
};
