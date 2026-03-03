'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useConnectMembers } from '@/features/dashboard/studynote/write/services/query';
import { useGetTeacherHomeworkDetail } from '@/features/homework/hooks/teacher/useTeacherHomeworkQuries';
import { useGetTeacherNotesList } from '@/features/study-notes/hooks';
import { mergeResolvedContentWithMediaIds } from '@/shared/components/editor';
import { nowForInput } from '@/shared/lib';
import { zodResolver } from '@hookform/resolvers/zod';

import { HomeworkForm, HomeworkFormSchema } from '../schemas/note';

export const HomeworkFormProvider = ({
  studyRoomId,
  homeworkId,
  isEditMode = false,
  children,
}: {
  studyRoomId: number;
  homeworkId?: number;
  isEditMode?: boolean;
  children: React.ReactNode;
}) => {
  /* 과제 상세 */
  const { data: homeworkDetail, isPending } = useGetTeacherHomeworkDetail(
    studyRoomId,
    homeworkId!
  );

  /* 수업노트 목록 */
  const { data: notes } = useGetTeacherNotesList({
    studyRoomId,
    pageable: { page: 0, size: 20, sortKey: 'LATEST_EDITED' },
    enabled: !!studyRoomId,
  });

  /* 학생 목록 */
  const { data: members } = useConnectMembers(studyRoomId);

  const methods = useForm<HomeworkForm>({
    resolver: zodResolver(HomeworkFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      content: {},
      deadline: nowForInput(),
      studentIds: [],
      reminderOffsets: [],
      teachingNoteIds: [],
      studyRoomId,
    },
  });

  /*  edit 모드 초기화  */
  useEffect(() => {
    if (!isEditMode || !homeworkDetail || !members || !notes || isPending)
      return;

    const { homework } = homeworkDetail;

    const rawContentString = homework.content;
    const resolvedContentString = homework.resolvedContent?.content;
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

    // 서버: 2026-01-20T01:13:00
    // input: 2026-01-20T01:13
    const normalizeDeadlineForInput = (deadline?: string) => {
      if (!deadline) return '';
      return deadline.slice(0, 16);
    };
    const deadlineForInput = normalizeDeadlineForInput(homework.deadline);

    const isPastDeadline = (deadline?: string) => {
      if (!deadline) return false;
      return new Date(deadline) < new Date();
    };
    methods.reset({
      title: homework.title,
      content,
      deadline: deadlineForInput,
      teachingNoteIds: homework.teachingNoteInfoList.map((n) => n.id),
      studentIds: homeworkDetail.homeworkStudents.map((hs) => {
        const member = members.find((m) => m.id === hs.studentId);

        return {
          id: hs.studentId,
          name: hs.studentName,
          parentCount: member?.parentCount ?? 0,
          role: 'ROLE_STUDENT',
        };
      }),
      reminderOffsets: homework.reminderOffsets ?? [],
      studyRoomId,
    });

    if (isPastDeadline(deadlineForInput)) {
      methods.setError('deadline', {
        type: 'manual',
        message:
          '이미 지난 마감 기한입니다. 마감 기한을 현재 이후로 수정해 주세요.',
      });
    }
  }, [
    isEditMode,
    homeworkDetail,
    members,
    notes,
    isPending,
    methods,
    studyRoomId,
  ]);

  if (isEditMode && isPending) {
    return <div>로딩 중...</div>;
  }

  return <FormProvider {...methods}>{children}</FormProvider>;
};
