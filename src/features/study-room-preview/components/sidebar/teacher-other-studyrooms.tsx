'use client';

import Link from 'next/link';

import { TextIcon } from '@/shared/components/icons';

type OtherStudyRoom = {
  id: number;
  name: string;
};

type TeacherOtherStudyroomsProps = {
  studyRoomName: string;
  teacherId: number;
  rooms: OtherStudyRoom[];
};

export const TeacherOtherStudyrooms = ({
  studyRoomName,
  teacherId,
  rooms,
}: TeacherOtherStudyroomsProps) => {
  return (
    <section className="flex flex-col gap-2">
      <p className="font-body2-heading tablet:font-body2-heading desktop:font-body1-heading text-gray-12">
        선생님의 다른 스터디룸
      </p>

      <div className="flex flex-col">
        <div className="group flex items-center gap-2 rounded-lg px-2 py-2">
          <TextIcon className="text-orange-7 h-5 w-5 shrink-0" />
          <p className="font-label-normal tablet:font-label-normal desktop:font-body2-normal text-orange-7 truncate">
            {studyRoomName}
          </p>
        </div>

        {rooms.map((room) => (
          <Link
            key={room.id}
            href={`/study-room-preview/${room.id}/${teacherId}`}
          >
            <div className="group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2">
              <TextIcon className="text-gray-scale-gray-70 group-hover:text-orange-7 h-5 w-5 shrink-0" />
              <p className="font-label-normal tablet:font-label-normal desktop:font-body2-normal text-gray-9 group-hover:text-orange-7 truncate">
                {room.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
