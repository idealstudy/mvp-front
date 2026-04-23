'use client';

import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { StudyNoteQueryKey } from '@/entities/study-note';
import { teacherKeys } from '@/entities/teacher';
import { StudyNoteDetailQueryKey } from '@/features/dashboard/studynote/detail/service/query-options';
import { StudyNoteWriteQueryKey } from '@/features/dashboard/studynote/write/services/query-options';
import { useUpdateStudyNote } from '@/features/study-notes/hooks';
import { prepareContentForSave } from '@/shared/components/editor';
import { Form } from '@/shared/components/ui/form';
import { PRIVATE } from '@/shared/constants';
import { getApiError } from '@/shared/lib';
import { classifyStudyNoteError, handleApiError } from '@/shared/lib/errors';
import { useQueryClient } from '@tanstack/react-query';

import { STUDY_NOTE_VISIBILITY } from '../../constant';
import { StudyNoteVisibility } from '../../type';
import { StudyNoteForm } from '../schemas/note';

type EditFormProps = {
  noteId: number;
  studyRoomId: number;
};

const StudyNoteEditForm = ({
  children,
  noteId,
  studyRoomId,
}: PropsWithChildren<EditFormProps>) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: updateStudyNote } = useUpdateStudyNote();
  const { handleSubmit, setError, resetField } =
    useFormContext<StudyNoteForm>();

  const onSubmit = (data: StudyNoteForm) => {
    const parsingData = transformFormDataToServerFormat(data);
    updateStudyNote(
      {
        teachingNoteId: noteId,
        studyRoomId: data.studyRoomId,
        title: parsingData.title,
        content: parsingData.content,
        visibility: parsingData.visibility,
        taughtAt: parsingData.taughtAt,
        studentIds: parsingData.studentIds,
        teachingNoteGroupId: data.teachingNoteGroupId ?? null,
        pageable: {
          page: 0,
          size: 20,
          sortKey: 'LATEST_EDITED',
        },
      },
      {
        onSuccess: async () => {
          // 상세 페이지는 두 가지 쿼리 키를 사용할 수 있으므로 모두 무효화

          // 1. StudyNoteDetailQueryKey (상세 페이지에서 사용)
          const detailQueryKey =
            StudyNoteDetailQueryKey.studyNoteDetail(noteId);
          // 2. StudyNoteQueryKey.detail (mutation에서 무효화하는 키)
          const noteDetailQueryKey = StudyNoteQueryKey.detail(noteId);

          // 두 쿼리 키 모두 무효화 및 즉시 재요청
          await queryClient.invalidateQueries({
            queryKey: detailQueryKey,
          });
          await queryClient.invalidateQueries({
            queryKey: noteDetailQueryKey,
          });

          // 데이터를 즉시 다시 가져오기
          await queryClient.refetchQueries({
            queryKey: detailQueryKey,
          });
          await queryClient.refetchQueries({
            queryKey: noteDetailQueryKey,
          });

          // 노트 목록 쿼리도 무효화
          await queryClient.invalidateQueries({
            queryKey: StudyNoteQueryKey.listPrefix(studyRoomId),
          });

          // 마이페이지 캐시 무효화
          queryClient.invalidateQueries({ queryKey: teacherKeys.all });

          // 상세 페이지로 이동 (데이터가 이미 갱신된 후)
          router.replace(`/study-rooms/${studyRoomId}/note/${noteId}`);
        },
        onError: (error) => {
          const apiError = getApiError(error);

          handleApiError(error, classifyStudyNoteError, {
            // DUPLICATED_TEACHING_NOTE_TITLE, TEACHING_NOTE_GROUP_NOT_EXIST
            onField: (message) => {
              if (apiError?.code === 'DUPLICATED_TEACHING_NOTE_TITLE') {
                setError('title', { message });
              }
              if (apiError?.code === 'TEACHING_NOTE_GROUP_NOT_EXIST') {
                queryClient.invalidateQueries({
                  queryKey: StudyNoteWriteQueryKey.studyNoteGroups(
                    data.studyRoomId
                  ),
                });
                resetField('teachingNoteGroupId');
              }
            },
            // TEACHING_NOTE_NOT_EXIST
            onContext: () => {
              router.replace(PRIVATE.NOTE.LIST(studyRoomId));
            },
            // MEMBER_NOT_EXIST
            onAuth: () => {
              setTimeout(() => router.replace('/login'), 1500);
            },
          });
        },
      }
    );
  };

  return <Form onSubmit={handleSubmit(onSubmit)}>{children}</Form>;
};

function transformVisibility(
  visibility: StudyNoteVisibility,
  isGuardianVisible: boolean
): StudyNoteVisibility {
  const visibilityMap: Partial<
    Record<StudyNoteVisibility, StudyNoteVisibility>
  > = {
    [STUDY_NOTE_VISIBILITY.SPECIFIC_STUDENTS_ONLY]:
      STUDY_NOTE_VISIBILITY.SPECIFIC_STUDENTS_AND_PARENTS,
    [STUDY_NOTE_VISIBILITY.STUDY_ROOM_STUDENTS_ONLY]:
      STUDY_NOTE_VISIBILITY.STUDY_ROOM_STUDENTS_AND_PARENTS,
  };

  return isGuardianVisible && visibilityMap[visibility]
    ? visibilityMap[visibility]
    : visibility;
}

function transformFormDataToServerFormat(formData: StudyNoteForm) {
  const isGuardianVisible = formData.isGuardianVisible ?? false;
  const { contentString, mediaIds } = prepareContentForSave(formData.content);

  return {
    title: formData.title,
    content: contentString,
    visibility: transformVisibility(
      formData.visibility as StudyNoteVisibility,
      isGuardianVisible
    ),
    taughtAt: new Date(formData.taughtAt).toISOString(),
    studentIds: formData.studentIds?.map((student) => student.id) ?? [],
    mediaIds,
  };
}

export default StudyNoteEditForm;
