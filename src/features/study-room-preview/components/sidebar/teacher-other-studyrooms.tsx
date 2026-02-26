'use client';

import { TextIcon } from '@/shared/components/icons';

const mockData = ['에듀중학교 복습반', '에듀중학교 선행반', '에듀중학교 햇반'];

export const TeacherOtherStudyrooms = () => {
  return (
    <section className="flex flex-col gap-2">
      <p className="font-body2-heading tablet:font-body2-heading desktop:font-body1-heading text-gray-12">
        선생님의 다른 스터디룸
      </p>
      <div className="flex flex-col">
        {mockData.map((room) => (
          <div
            key={room}
            className="group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2"
          >
            <TextIcon className="text-gray-scale-gray-70 group-hover:text-orange-7 h-5 w-5 shrink-0" />
            <p className="font-label-normal tablet:font-label-normal desktop:font-body2-normal text-gray-9 group-hover:text-orange-7 truncate">
              {room}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
