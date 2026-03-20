'use client';

import Image from 'next/image';

import { TextViewer, parseEditorContent } from '@/shared/components/editor';
import { getRelativeTimeString } from '@/shared/lib';

type ReadonlyFeedbackProps = {
  content: string;
  regDate: string | null;
};

// 학생이 다른 학생 과제에 남겨진 피드백을 보지 못하게 하는 ui
export const StudentFeedbackBlock = ({
  content,
  regDate,
}: ReadonlyFeedbackProps) => {
  const parsedContent = parseEditorContent(content);
  if (!regDate) return null;

  return (
    <div className="border-line-line1 flex flex-col gap-5 rounded-xl border bg-white px-8 py-8">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-3">
          <Image
            src="/qna/reply.svg"
            width={56}
            height={24}
            alt="replay icon"
          />
          <span className="font-body2-heading">선생님 피드백</span>
        </div>
      </div>
      <TextViewer value={parsedContent} />

      <span className="font-caption-normal text-gray-scale-gray-60 self-end">
        {getRelativeTimeString(regDate)} 작성
      </span>
    </div>
  );
};
