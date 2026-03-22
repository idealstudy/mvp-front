'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Button, Dialog } from '@/shared/components/ui';

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
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleShareProfile = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/profile/teacher/${teacherId}`
    );
    setIsShareDialogOpen(true);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-col items-center">
          <Image
            src="/profile/ic_studynote.svg"
            width={24}
            height={24}
            alt="누적 수업노트"
          />
          <span className="text-text-sub2 font-label-normal mt-1">
            누적 수업노트
          </span>
          <span className="font-headline2-heading text-key-color-primary">
            {teacherNoteCount.toLocaleString()}개
          </span>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/profile/ic_person.svg"
            width={24}
            height={24}
            alt="누적 학생"
          />
          <span className="text-text-sub2 font-label-normal mt-1">
            누적 학생
          </span>
          <span className="font-headline2-heading text-key-color-primary">
            {studentCount.toLocaleString()}명
          </span>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/profile/ic_review.svg"
            width={24}
            height={24}
            alt="누적 후기"
          />
          <span className="text-text-sub2 font-label-normal mt-1">
            누적 후기
          </span>
          <span className="font-headline2-heading text-key-color-primary">
            {reviewCount.toLocaleString()}개
          </span>
        </div>
      </div>

      <Button onClick={handleShareProfile}>프로필 공유하기</Button>

      <div>
        <h4 className="font-body1-heading mb-2">간단 소개</h4>
        <p className="break-words whitespace-pre-wrap">{description}</p>
      </div>

      {/* 공유하기 다이얼로그 */}
      <Dialog
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
      >
        <Dialog.Content className="max-w-120">
          <Dialog.Body className="mb-8 text-center">
            <Dialog.Title>링크가 복사되었습니다.</Dialog.Title>
          </Dialog.Body>
          <Dialog.Footer className="flex justify-center">
            <Dialog.Close asChild>
              <Button
                size="xsmall"
                className="w-30"
              >
                확인
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
