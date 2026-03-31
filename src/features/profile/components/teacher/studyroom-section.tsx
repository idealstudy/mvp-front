import Image from 'next/image';
import Link from 'next/link';

import { FrontendTeacherStudyRoomList } from '@/entities/teacher';

export default function StudyroomSection({
  studyrooms,
  teacherId,
}: {
  studyrooms: FrontendTeacherStudyRoomList;
  teacherId: number;
}) {
  return (
    <>
      {studyrooms.map((studyroom) => (
        <Link
          href={`/study-room-preview/${studyroom.id}/${teacherId}`}
          className="hover:bg-gray-1 flex items-center gap-3 p-2 hover:rounded-xl"
          key={studyroom.id}
        >
          <Image
            src={'/studyroom/profile.svg'}
            alt={'스터디룸 리스트 이미지'}
            width={100}
            height={100}
            className="h-14 w-14 rounded-xl object-cover"
          />
          <div>
            <h4 className="font-body2-normal">{studyroom.name}</h4>
            <p className="font-caption-normal text-text-sub2 mt-1">
              수업노트 {studyroom.teachingNoteCount}장
              <span aria-hidden> | </span>
              학생 {studyroom.studentCount}명<span aria-hidden> | </span>
              질문 {studyroom.qnaCount}개
            </p>
          </div>
        </Link>
      ))}
    </>
  );
}
