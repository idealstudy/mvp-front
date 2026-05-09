'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui';
import { PUBLIC } from '@/shared/constants';
import { useMemberStore } from '@/store';

interface TeacherProfileExtraProps {
  teacherNoteCount: number;
  studentCount: number;
  reviewCount: number;
  description: string;
  teacherId: number;
}

export default function TeacherProfileExtra({
  teacherNoteCount,
  studentCount,
  reviewCount,
  description,
  teacherId,
}: TeacherProfileExtraProps) {
  const router = useRouter();
  const role = useMemberStore((state) => state.member?.role);

  return (
    <>
      <div className="divide-gray-3 flex divide-x">
        <div className="flex flex-1 flex-col items-center">
          <span className="font-headline2-heading">
            {teacherNoteCount.toLocaleString()}개
          </span>
          <span className="text-text-sub2 font-label-normal mt-1">
            수업노트
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center">
          <span className="font-headline2-heading">
            {reviewCount.toLocaleString()}개
          </span>
          <span className="text-text-sub2 font-label-normal mt-1">후기</span>
        </div>
        <div className="flex flex-1 flex-col items-center">
          <span className="font-headline2-heading">
            {studentCount.toLocaleString()}명
          </span>
          <span className="text-text-sub2 font-label-normal mt-1">학생</span>
        </div>
      </div>

      <div>
        <h4 className="font-body1-heading mb-2">간단 소개</h4>
        <p className="break-words whitespace-pre-wrap">{description}</p>
      </div>

      {role !== 'ROLE_TEACHER' && (
        <Button
          onClick={() => {
            router.push(PUBLIC.INQUIRY.CREATE(teacherId));
          }}
        >
          수업 상담하기
        </Button>
      )}
    </>
  );
}
