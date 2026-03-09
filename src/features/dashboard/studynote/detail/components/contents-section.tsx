'use client';

import Image from 'next/image';

import { useStudyNoteDetailQuery } from '@/features/dashboard/studynote/detail/service/query';
import { ColumnLayout } from '@/layout/column-layout';
import { TextViewer } from '@/shared/components/editor';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const StudyNoteDetailContentsSection = ({ id }: { id: string }) => {
  const { data } = useStudyNoteDetailQuery(Number(id));

  if (!data) return null;

  const contentString = data.resolvedContent?.content || data.content;
  const content = JSON.parse(contentString);
  const formattedDate = format(
    new Date(data.taughtAt),
    'yyyy. MM. dd (E) 수업',
    {
      locale: ko,
    }
  );

  return (
    <ColumnLayout.Right className="border-line-line1 desktop:max-w-[740px] max-h-[calc(100vh-var(--spacing-header-height)-48px)] overflow-y-auto rounded-xl border bg-white px-8 py-10">
      <div className="mb-6 flex items-start justify-between">
        <div className="bg-background-orange text-key-color-primary font-body2-normal flex w-fit items-center gap-2 rounded-lg px-2 py-1">
          <Image
            src="/studynotes/cal.svg"
            alt="calendar"
            width={14}
            height={14}
          />
          <span>{formattedDate}</span>
        </div>
      </div>

      <TextViewer value={content} />
    </ColumnLayout.Right>
  );
};

export default StudyNoteDetailContentsSection;
