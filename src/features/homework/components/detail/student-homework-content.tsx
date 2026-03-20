import { TextViewer, parseEditorContent } from '@/shared/components/editor';
import { getRelativeTimeString } from '@/shared/lib';

type StudentAssignmentContentProps = {
  content: string;
  authorName: string;
  regDate: string;
};

// 선생님이 낸 과제와 다른 학생이 남긴 과제 못보게 하는 ui

export const StudentHomeworkContent = ({
  content,
  authorName,
  regDate,
}: StudentAssignmentContentProps) => {
  const parsedContent = parseEditorContent(content);

  return (
    <div className="border-line-line1 flex flex-col gap-5 rounded-xl border bg-white p-10">
      <div className="flex items-center gap-3">
        <div className="bg-gray-scale-gray-10 h-10 w-10 rounded-full" />
        <span className="font-body2-heading">{authorName}</span>
      </div>

      <TextViewer value={parsedContent} />

      <span className="font-caption-normal text-gray-scale-gray-60 self-end">
        {getRelativeTimeString(regDate)} 작성
      </span>
    </div>
  );
};
