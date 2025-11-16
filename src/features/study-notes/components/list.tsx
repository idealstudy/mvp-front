'use client';

import { useState } from 'react';

import Image from 'next/image';

import type {
  StudyNote,
  StudyNoteGroupPageable,
} from '@/features/study-notes/model';
import { ListItem } from '@/features/study-rooms/components/common/list-item';
import { formatMMDDWeekday, getRelativeTimeString } from '@/shared/lib/utils';

import { StudyNotesDropdown } from './dropdown';

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

  const image = (item: StudyNote) => {
    switch (item.visibility) {
      case 'PUBLIC':
        return (
          <Image
            src="/studynotes/read-global.svg"
            width={28}
            height={28}
            alt="study-notes"
            className="h-[28px] w-[28px] cursor-pointer"
          />
        );
      case 'SPECIFIC_STUDENTS_ONLY':
        return (
          <Image
            src="/studynotes/read-students.svg"
            width={28}
            height={28}
            alt="study-notes"
            className="h-[28px] w-[28px] cursor-pointer"
          />
        );
      case 'SPECIFIC_STUDENTS_AND_PARENTS':
        return (
          <Image
            src="/studynotes/read-students.svg"
            width={28}
            height={28}
            alt="study-notes"
            className="h-[28px] w-[28px] cursor-pointer"
          />
        );
      case 'STUDY_ROOM_STUDENTS_AND_PARENTS':
        return (
          <Image
            src="/studynotes/read-students.svg"
            width={28}
            height={28}
            alt="study-notes"
            className="h-[28px] w-[28px] cursor-pointer"
          />
        );
      case 'TEACHER_ONLY':
        return (
          <Image
            src="/studynotes/read-secret.svg"
            width={28}
            height={28}
            alt="study-notes"
            className="h-[28px] w-[28px] cursor-pointer"
          />
        );
      default:
        return null;
    }
  };

  return data.map((item) => (
    <ListItem
      key={item.id}
      title={item.title}
      tag={
        item.groupId && (
          <p className="text-gray-scale-gray-60 bg-gray-scale-gray-5 flex h-5 items-center justify-center rounded-[4px] p-1 text-[10px]">
            {item.groupName}
          </p>
        )
      }
      icon={image(item)}
      subtitle={
        item.updatedAt === item.taughtAt
          ? `${getRelativeTimeString(item.taughtAt)} 작성`
          : `${getRelativeTimeString(item.updatedAt)} 수정`
      }
      date={formatMMDDWeekday(item.taughtAt)}
      dropdown={
        <StudyNotesDropdown
          open={open}
          handleOpen={handleOpen}
          item={item}
          studyRoomId={studyRoomId}
          pageable={pageable}
          keyword={keyword}
        />
      }
      href={`/study-note/${item.id}`}
      id={item.id}
    />
  ));
};
