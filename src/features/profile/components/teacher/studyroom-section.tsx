import Image from 'next/image';
import Link from 'next/link';

import { ProfileWithMeta } from '@/entities/profile';
import { StudyRoom, Teacher } from '@/features/dashboard/studynote/write/type';

type Props = {
  profile: ProfileWithMeta;
};

const teacher: Teacher = {
  id: 1,
  email: 'aa@n.com',
  password: 'aaaa',
  name: '강사이름',
  nickname: '강사닉네임',
  phoneNumber: '010-0000-0000',
  birthDate: '2025-12-31',
  acceptOptionalTerm: true,
  role: 'ROLE_TEACHER',
  regDate: '2025-12-31',
  modDate: '2025-12-31',
};

const studyRooms: StudyRoom[] = [
  {
    id: 1,
    name: '에듀중학교 복습반1',
    description: '복습반 스터디룸',
    teacher: teacher,
    capacity: 10,
    visibility: 'PUBLIC',
    startDate: '2025-12-31',
    endDate: '2025-12-31',
    regDate: '2025-12-31',
    modDate: '2025-12-31',
    teacherId: 1,
    numberOfTeachingNote: 3,
    studentNames: ['김00', '이00'],
  },
  {
    id: 1,
    name: '에듀중학교 복습반2',
    description: '복습반 스터디룸',
    teacher: teacher,
    capacity: 10,
    visibility: 'PUBLIC',
    startDate: '2025-12-31',
    endDate: '2025-12-31',
    regDate: '2025-12-31',
    modDate: '2025-12-31',
    teacherId: 1,
    numberOfTeachingNote: 33,
    studentNames: ['김00'],
  },
  {
    id: 1,
    name: '에듀중학교 복습반3',
    description: '복습반 스터디룸',
    teacher: teacher,
    capacity: 10,
    visibility: 'PUBLIC',
    startDate: '2025-12-31',
    endDate: '2025-12-31',
    regDate: '2025-12-31',
    modDate: '2025-12-31',
    teacherId: 1,
    numberOfTeachingNote: 13,
    studentNames: ['김00', '이00', '박00'],
  },
];

export default function StudyroomSection({}: Props) {
  return (
    <>
      {studyRooms.map((studyRoom, idx) => (
        <Link
          href="#"
          className="hover:bg-gray-scale-gray-1 flex items-center gap-3 p-4 hover:rounded-xl"
          key={idx}
        >
          <Image
            src={'/studyroom/profile.svg'}
            alt={'스터디룸 리스트 이미지'}
            width={100}
            height={100}
            className="h-16 w-16 rounded-xl object-cover"
          />
          <div>
            <h4>{studyRoom.name}</h4>
            <p className="font-caption-normal text-text-sub2 mt-1">
              수업노트 {studyRoom.numberOfTeachingNote}장
              <span aria-hidden> | </span>
              학생 {studyRoom.studentNames.length}명<span aria-hidden> | </span>
              질문 {999}개
            </p>
          </div>
        </Link>
      ))}
    </>
  );
}
