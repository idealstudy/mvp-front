'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { getRelativeTimeString } from '@/lib/utils';

import { StudyNotesDropdown } from './dialog';

const data = [
  {
    id: 1,
    title: '지수함수와 로그함수 #008',
    date: '2025-08-27',
    updatedAt: '2025-08-26T23:59:59',
    group: '그룹1',
    groupId: 1,
    option: 'students',
  },
  {
    id: 2,
    title: '지수함수와 로그함수 #008',
    date: '2025-08-27',
    updatedAt: '2025-08-22T23:59:59',
    group: '그룹1',
    groupId: 1,
    option: 'global',
  },
  {
    id: 3,
    title: '지수함수와 로그함수 #008',
    date: '2025-08-27',
    updatedAt: '2025-08-20T23:59:59',
    option: 'secret',
  },
];

export const StudyNotesList = () => {
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
        {item.option === 'global' && (
          <Image
            src="/studynotes/read-global.png"
            width={28}
            height={28}
            alt="study-notes"
            className="h-[28px] w-[28px] cursor-pointer"
          />
        )}
        {item.option === 'students' && (
          <Image
            src="/studynotes/read-students.png"
            width={28}
            height={28}
            alt="study-notes"
            className="h-[28px] w-[28px] cursor-pointer"
          />
        )}
        {item.option === 'secret' && (
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
            {item.group && (
              <p className="text-gray-scale-gray-60 flex h-5 items-center justify-center rounded-[4px] bg-[#f3f3f3] p-1 text-[10px]">
                {item.group}
              </p>
            )}
          </div>
          <p className="font-caption-normal text-gray-scale-gray-60">
            {getRelativeTimeString(item.updatedAt)} 수정
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-1">
        <p className="text-gray-scale-gray-70">12/12 (금)</p>
        <StudyNotesDropdown
          open={open}
          handleOpen={handleOpen}
          item={item}
        />
      </div>
    </Link>
  ));
};
