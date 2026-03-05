'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useStudyNoteDetailQuery } from '@/features/dashboard/studynote/detail/service/query';
import { mergeResolvedContentWithMediaIds } from '@/shared/components/editor';
import { zodResolver } from '@hookform/resolvers/zod';

import { StudyNoteForm, studyNoteFormSchema } from '../schemas/note';

export const RequiredMark = () => {
  return <span className="text-key-color-primary"> *</span>;
};

// 스터디 노트
export const StudyNoteFormProvider = ({
  defaultStudyRoomId,
  noteId,
  isEditMode = false,
  children,
}: {
  defaultStudyRoomId: number;
  noteId?: number;
  isEditMode?: boolean;
  children: React.ReactNode;
}) => {
  // 편집 모드일 때 기존 데이터 조회
  const { data: noteDetail, isLoading } = useStudyNoteDetailQuery(noteId!, {
    enabled: isEditMode && !!noteId,
  });

  const methods = useForm<StudyNoteForm>({
    resolver: zodResolver(studyNoteFormSchema),
    defaultValues: {
      title: '',
      content: {},
      studentIds: [],
      studyRoomId: defaultStudyRoomId,
      taughtAt: new Date().toISOString().split('T')[0],
    },
    mode: 'onChange',
  });

  // 편집 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (isEditMode && noteDetail && !isLoading) {
      const rawContentString = noteDetail.content;
      const resolvedContentString = noteDetail.resolvedContent?.content;
      const emptyDoc = { type: 'doc', content: [{ type: 'paragraph' }] };
      const parseContent = (value: string) => {
        try {
          return JSON.parse(value);
        } catch {
          return emptyDoc;
        }
      };

      const rawContent = parseContent(rawContentString);
      const resolvedContent = parseContent(
        resolvedContentString ?? rawContentString
      );

      const content = resolvedContentString
        ? mergeResolvedContentWithMediaIds(rawContent, resolvedContent)
        : rawContent;

      // visibility 변환: 'PUBLIC' | 'PRIVATE' -> 폼 스키마 타입
      const visibility =
        noteDetail.visibility === 'PRIVATE'
          ? 'TEACHER_ONLY'
          : noteDetail.visibility;

      const formData = {
        title: noteDetail.title,
        content,
        studentIds: noteDetail.studentInfos.map((info) => ({
          id: info.studentId,
        })),
        studyRoomId: noteDetail.studyRoomId,
        taughtAt: new Date(noteDetail.taughtAt).toISOString().split('T')[0],
        visibility: visibility as
          | 'TEACHER_ONLY'
          | 'SPECIFIC_STUDENTS_ONLY'
          | 'SPECIFIC_STUDENTS_AND_PARENTS'
          | 'STUDY_ROOM_STUDENTS_ONLY'
          | 'STUDY_ROOM_STUDENTS_AND_PARENTS'
          | 'PUBLIC',
        teachingNoteGroupId: noteDetail.groupId ?? undefined,
      };

      methods.reset(formData);
    }
  }, [isEditMode, noteDetail, isLoading, methods]);

  if (isEditMode && isLoading) {
    return <div>로딩 중...</div>;
  }

  return <FormProvider {...methods}>{children}</FormProvider>;
};
