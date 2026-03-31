import Image from 'next/image';
import Link from 'next/link';

import {
  FrontendStudentStudyRoomList,
  FrontendStudentStudyRoomListItem,
} from '@/entities/student';
import { PRIVATE } from '@/shared/constants';
import { cn } from '@/shared/lib';

interface StudyroomSectionProps {
  data: FrontendStudentStudyRoomList;
}

const STATE_LABEL: Partial<
  Record<FrontendStudentStudyRoomListItem['state'], string>
> = {
  APPROVED: '참여중',
  TERMINATED: '졸업',
};

export default function StudyroomSection({ data }: StudyroomSectionProps) {
  return (
    <>
      {data.map((item) => (
        <Link
          href={PRIVATE.ROOM.DETAIL(item.id)}
          className="hover:bg-gray-1 flex items-center gap-3 p-2 hover:rounded-xl"
          key={item.id}
        >
          <Image
            src={'/studyroom/profile.svg'}
            alt={'스터디룸 리스트 이미지'}
            width={100}
            height={100}
            className="h-14 w-14 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h4 className="font-body2-normal">{item.name}</h4>
            <p className="font-caption-normal text-text-sub2 mt-1">
              수업노트 {item.teachingNoteCount}장<span aria-hidden> | </span>
              학생 {item.studentCount}명<span aria-hidden> | </span>
              질문 {item.qnaCount}개
            </p>
          </div>
          {STATE_LABEL[item.state] ? (
            <span
              className={cn(
                'font-label-normal px-3 py-1.5 whitespace-nowrap',
                item.state === 'TERMINATED'
                  ? 'bg-gray-1'
                  : 'bg-orange-1 text-key-color-primary'
              )}
            >
              {STATE_LABEL[item.state]}
            </span>
          ) : undefined}
        </Link>
      ))}
    </>
  );
}
