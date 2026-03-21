import { TextViewer, parseEditorContent } from '@/shared/components/editor';
import { getRelativeTimeString } from '@/shared/lib/utils';

type Props = {
  content: string;
  authorName: string;
  regDate: string;
};

export const TeacherHomeworkContent = ({
  content,
  authorName,
  regDate,
}: Props) => {
  const parsedContent = parseEditorContent(content);

  return (
    <div className="border-line-line1 flex flex-col gap-5 rounded-xl border bg-white p-10">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-100" />
        <span className="font-body2-heading">{authorName}</span>
      </div>

      <TextViewer value={parsedContent} />

      <span className="self-end text-xs text-gray-500">
        {getRelativeTimeString(regDate)} 작성
      </span>
    </div>
  );
};
