'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { formatMMDDWeekday, getRelativeTimeString } from '@/lib/utils';

import { StudyNotesDropdown } from './dropdown';
import type { StudyNote, StudyNoteGroupPageable } from './type';

export const StudyNotesList = ({
  data,
  studyRoomId,
  pageable,
  keyword,
}: {
  data: StudyNote[];
  studyRoomId: number;
  pageable: StudyNoteGroupPageable;
  keyword: string;
}) => {
  const [open, setOpen] = useState(0);

  const handleOpen = (id: number) => {
    setOpen(open === id ? 0 : id);
  };

  return data.map((item) => (
    <Link
      key={item.id}
      className="font-body2-normal hover:bg-gray-scale-gray-5 flex h-[66px] w-full flex-row items-center justify-between gap-4 bg-white px-4 py-3"
      href="#"
    >
      <div className="flex flex-row items-center gap-3">
        {item.visibility === 'PUBLIC' && (
          <Image
            src="/studynotes/read-global.png"
            width={28}
            height={28}
            alt="study-notes"
            className="h-[28px] w-[28px] cursor-pointer"
          />
        )}
        {(item.visibility === 'SPECIFIC_STUDENTS_ONLY' ||
          item.visibility === 'SPECIFIC_STUDENTS_AND_PARENTS' ||
          item.visibility === 'STUDY_ROOM_STUDENTS_AND_PARENTS') && (
          <Image
            src="/studynotes/read-students.png"
            width={28}
            height={28}
            alt="study-notes"
            className="h-[28px] w-[28px] cursor-pointer"
          />
        )}
        {item.visibility === 'TEACHER_ONLY' && (
          <Image
            src="/studynotes/read-secret.png"
            width={28}
            height={28}
            alt="study-notes"
            className="h-[28px] w-[28px] cursor-pointer"
          />
        )}

        <div className="flex flex-col items-start justify-between">
          <div className="flex flex-row items-center gap-2">
            <p>{item.title}</p>
            {item.groupId && (
              <p className="text-gray-scale-gray-60 flex h-5 items-center justify-center rounded-[4px] bg-[#f3f3f3] p-1 text-[10px]">
                {item.groupName}
              </p>
            )}
          </div>
          {/* 수정이 되지 않았을 시 문구가 작성으로 바뀌는데, 후에 추가 예정 */}
          <p className="font-caption-normal text-gray-scale-gray-60">
            {item.updatedAt === item.taughtAt
              ? `${getRelativeTimeString(item.taughtAt)} 작성`
              : `${getRelativeTimeString(item.updatedAt)} 수정`}
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-1">
        <p className="text-gray-scale-gray-70">
          {formatMMDDWeekday(item.taughtAt)}
        </p>
        <StudyNotesDropdown
          open={open}
          handleOpen={handleOpen}
          item={item}
          studyRoomId={studyRoomId}
          pageable={pageable}
          keyword={keyword}
        />
      </div>
    </Link>
  ));
};
