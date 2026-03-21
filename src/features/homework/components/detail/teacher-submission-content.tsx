import { useState } from 'react';

import Image from 'next/image';

import { HOMEWORK_SUBMIT_STATUS_LABEL } from '@/entities/homework/core';
import type { HomeworkSubmitStatus } from '@/entities/homework/types';
import { TextViewer, parseEditorContent } from '@/shared/components/editor';
import { DropdownMenu } from '@/shared/components/ui/dropdown-menu';
import { getRelativeTimeString } from '@/shared/lib/utils';

import { FeedbackFormProvider } from '../write/components/feedback-form-provider';

type Props = {
  homeworkStudentId: number;
  content: string;
  authorName: string;
  regDate: string;
  submitStatus: HomeworkSubmitStatus;
  homeworkId: number;
  studyRoomId: number;
  hasFeedback: boolean;
};

export const TeacherHomeworkSubmissionContent = ({
  homeworkStudentId,
  content,
  authorName,
  regDate,
  submitStatus,
  homeworkId,
  studyRoomId,
  hasFeedback,
}: Props) => {
  const parsedContent = parseEditorContent(content);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <>
      <div className="border-line-line1 flex flex-col gap-5 rounded-xl border bg-white p-10">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-100" />
            <span className="font-body2-heading">{authorName}</span>

            <span className="rounded-full border px-3 py-1 text-xs">
              {HOMEWORK_SUBMIT_STATUS_LABEL[submitStatus]}
            </span>
          </div>
          {!hasFeedback ? (
            <DropdownMenu>
              <DropdownMenu.Trigger className="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100">
                <Image
                  src="/studynotes/gray-kebab.svg"
                  width={24}
                  height={24}
                  alt="study-notes"
                  className="cursor-pointer"
                />
              </DropdownMenu.Trigger>

              <DropdownMenu.Content>
                <DropdownMenu.Item
                  onClick={() => {
                    setIsClicked(true);
                  }}
                >
                  피드백 하기
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          ) : (
            <span className="text-gray-scale-gray-50 text-xs">피드백 완료</span>
          )}
        </div>

        <TextViewer value={parsedContent} />
        <span className="font-caption-normal text-gray-scale-gray-60 self-end">
          {getRelativeTimeString(regDate) + ' 제출'}
        </span>
      </div>
      {isClicked ? (
        <FeedbackFormProvider
          studyRoomId={studyRoomId}
          homeworkId={homeworkId}
          homeworkStudentId={homeworkStudentId}
          setIsClicked={setIsClicked}
        />
      ) : null}
    </>
  );
};
