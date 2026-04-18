'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useParams, useSearchParams } from 'next/navigation';

import type { StudentNoteDetail } from '@/entities/student-study-note';
import { SUBJECT_TO_KOREAN } from '@/features/dashboard/components/timer/constants';
import BackLink from '@/features/dashboard/studynote/components/back-link';
import {
  StudentStudyNoteFields,
  StudentStudyNoteSubmitButton,
} from '@/features/student-study-note/components/student-study-note-form';
import {
  useStudentNoteDetail,
  useStudentNoteUpdate,
} from '@/features/student-study-note/hooks';
import {
  StudentStudyNoteForm,
  studentStudyNoteSchema,
} from '@/features/student-study-note/schemas/study-note';
import { ColumnLayout } from '@/layout/column-layout';
import { TextViewer, prepareContentForSave } from '@/shared/components/editor';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JSONContent } from '@tiptap/react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BookOpen, Pencil, Tag } from 'lucide-react';

const parseContent = (data: StudentNoteDetail): unknown => {
  const raw = data.resolvedContent?.content || data.content;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

type EditFormProps = {
  data: StudentNoteDetail;
  noteId: number;
  onCancel: () => void;
};

const LAYOUT_CLASS = 'tablet:flex-col desktop:flex-col flex flex-col gap-0';

const EditForm = ({ data, noteId, onCancel }: EditFormProps) => {
  const parsedContent = parseContent(data);
  const { mutate: updateNote, isPending: isUpdating } = useStudentNoteUpdate();

  const methods = useForm<StudentStudyNoteForm>({
    resolver: zodResolver(studentStudyNoteSchema),
    defaultValues: {
      title: data.title ?? '',
      studiedAt:
        data.regDate?.substring(0, 10) ??
        new Date().toISOString().substring(0, 10),
      subject: data.subject ?? '',
      content: (parsedContent ?? {}) as JSONContent,
    },
    mode: 'onChange',
  });

  const onSubmit = (formData: StudentStudyNoteForm) => {
    const { contentString, mediaIds } = prepareContentForSave(formData.content);
    updateNote(
      {
        studyNoteId: noteId,
        body: {
          title: formData.title,
          subject: formData.subject,
          content: contentString,
          mediaIds,
          finishTimestamp: new Date().toISOString(),
        },
      },
      { onSuccess: onCancel }
    );
  };

  return (
    <ColumnLayout className={`${LAYOUT_CLASS} pb-10`}>
      <BackLink className="mb-6" />
      <div className="border-line-line1 w-full rounded-xl border bg-white px-8 py-10">
        <div className="mb-8">
          <div className="text-key-color-primary font-semibold">
            학습노트 편집
          </div>
          <h1 className="mt-2 text-[32px] font-bold">
            학습 내용을
            <br />
            수정해보세요.
          </h1>
        </div>
        <FormProvider {...methods}>
          <Form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="space-y-8">
              <StudentStudyNoteFields />
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outlined"
                  size="medium"
                  onClick={onCancel}
                  className="w-[120px] rounded-sm"
                >
                  취소
                </Button>
                <StudentStudyNoteSubmitButton isPending={isUpdating} />
              </div>
            </div>
          </Form>
        </FormProvider>
      </div>
    </ColumnLayout>
  );
};

const StudentStudyNoteDetailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const noteId = Number(params.id);

  const [isEditing, setIsEditing] = useState(
    searchParams.get('edit') === 'true'
  );

  const { data, isPending, isError } = useStudentNoteDetail(noteId);

  if (isPending) {
    return (
      <ColumnLayout className={LAYOUT_CLASS}>
        <BackLink className="mb-6" />
        <div className="border-line-line1 h-64 w-full animate-pulse rounded-xl border bg-white" />
      </ColumnLayout>
    );
  }

  if (isError || !data) {
    return (
      <ColumnLayout className={LAYOUT_CLASS}>
        <BackLink className="mb-6" />
        <div className="border-line-line1 flex h-64 w-full items-center justify-center rounded-xl border bg-white">
          <p className="font-body2-normal text-gray-8">
            학습 일지를 불러올 수 없어요.
          </p>
        </div>
      </ColumnLayout>
    );
  }

  if (isEditing) {
    return (
      <EditForm
        data={data}
        noteId={noteId}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const parsedContent = parseContent(data);
  const formattedDate = data.regDate
    ? format(new Date(data.regDate), 'yyyy. MM. dd (E)', { locale: ko })
    : null;

  return (
    <ColumnLayout className={LAYOUT_CLASS}>
      <BackLink className="mb-6" />
      <ColumnLayout className="desktop:px-0 items-start gap-6 p-0">
        <ColumnLayout.Left className="border-line-line1 !static top-0 h-fit space-y-5 rounded-xl border bg-white p-10">
          <div className="flex items-start justify-between gap-2">
            <h1 className="font-headline1-heading text-text-main">
              {data.title}
            </h1>
            <Button
              type="button"
              variant="outlined"
              size="xsmall"
              onClick={() => setIsEditing(true)}
              className="shrink-0"
            >
              <Pencil
                size={14}
                className="mr-1"
              />
              편집
            </Button>
          </div>

          <hr className="border-line-line1 border" />

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="bg-background-gray text-text-sub2 font-label-normal flex w-fit items-center gap-2 rounded-lg px-3 py-2">
                <Tag size={14} />
                <span>과목</span>
              </div>
              <p className="font-body2-normal text-text-main">
                {data.subject
                  ? (SUBJECT_TO_KOREAN[data.subject] ?? data.subject)
                  : ''}
              </p>
            </div>

            {formattedDate && (
              <div className="space-y-2">
                <div className="bg-background-gray text-text-sub2 font-label-normal flex w-fit items-center gap-2 rounded-lg px-3 py-2">
                  <BookOpen size={14} />
                  <span>학습 날짜</span>
                </div>
                <p className="font-body2-normal text-text-main">
                  {formattedDate}
                </p>
              </div>
            )}
          </div>
        </ColumnLayout.Left>

        <ColumnLayout.Right className="border-line-line1 desktop:max-w-[740px] max-h-[calc(100vh-var(--spacing-header-height)-48px)] overflow-y-auto rounded-xl border bg-white px-8 py-10">
          {parsedContent ? (
            <TextViewer value={parsedContent} />
          ) : (
            <p className="font-body2-normal text-gray-8">
              작성된 내용이 없어요.
            </p>
          )}
        </ColumnLayout.Right>
      </ColumnLayout>
    </ColumnLayout>
  );
};

export default StudentStudyNoteDetailPage;
