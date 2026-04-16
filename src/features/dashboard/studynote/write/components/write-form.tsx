'use client';

import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { teacherKeys } from '@/entities/teacher';
import { useUpdateTeacherOnboarding } from '@/features/dashboard/hooks/use-update-onboarding';
import { StudyNoteWriteQueryKey } from '@/features/dashboard/studynote/write/services/query-options';
import { prepareContentForSave } from '@/shared/components/editor';
import { Form } from '@/shared/components/ui/form';
import { PRIVATE } from '@/shared/constants';
import { getApiError } from '@/shared/lib';
import { trackStudynoteCreateSuccess } from '@/shared/lib/analytics';
import { classifyStudyNoteError, handleApiError } from '@/shared/lib/errors';
import { useMemberStore } from '@/store';
import { useQueryClient } from '@tanstack/react-query';

import { STUDY_NOTE_VISIBILITY } from '../../constant';
import { StudyNoteVisibility } from '../../type';
import { StudyNoteForm } from '../schemas/note';
import { useWriteStudyNoteMutation } from '../services/query';

// studynote
export const StudyNoteWriteForm = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const session = useMemberStore((s) => s.member);
  const { sendOnboarding } = useUpdateTeacherOnboarding('CREATE_CLASS_NOTE');

  const queryClient = useQueryClient();

  const { mutate } = useWriteStudyNoteMutation();
  const { handleSubmit, setError, resetField } =
    useFormContext<StudyNoteForm>();

  const onSubmit = (data: StudyNoteForm) => {
    const parsingData = transformFormDataToServerFormat(data);
    mutate(parsingData, {
      onSuccess: () => {
        // 수업노트 저장 성공 이벤트
        const content = data.content;
        const contentString = JSON.stringify(content);
        const hasContent = contentString.length > 2; // '{}'보다 큰지 확인

        trackStudynoteCreateSuccess(
          {
            room_id: data.studyRoomId,
            group_id: data.teachingNoteGroupId ?? null,
            has_group: !!data.teachingNoteGroupId,
            has_title: !!data.title,
            has_student: (data.studentIds?.length ?? 0) > 0,
            study_date: data.taughtAt || null,
            has_content: hasContent,
            image_count: 0, // TODO: 실제 이미지 개수 추적 필요
            visibility:
              data.visibility === 'TEACHER_ONLY' ? 'PRIVATE' : 'PUBLIC',
          },
          session?.role ?? null
        );
        const roomId = data.studyRoomId;
        router.replace(PRIVATE.NOTE.LIST(roomId));
        // 온보딩 반영
        sendOnboarding();

        // 마이페이지 캐시 무효화
        queryClient.invalidateQueries({ queryKey: teacherKeys.all });
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
          // STUDY_ROOM_NOT_EXIST
          onContext: () => {
            router.replace(PRIVATE.DASHBOARD.INDEX);
          },
          // MEMBER_NOT_EXIST
          onAuth: () => {
            setTimeout(() => router.replace('/login'), 1500);
          },
        });
      },
    });
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

  // content를 저장용으로 변환 (blob URL -> media://{mediaId})
  const { contentString, mediaIds } = prepareContentForSave(formData.content);

  return {
    studyRoomId: formData.studyRoomId,
    title: formData.title,
    content: contentString,
    visibility: transformVisibility(
      formData.visibility as StudyNoteVisibility,
      isGuardianVisible
    ),
    taughtAt: new Date(formData.taughtAt).toISOString(),
    studentIds: formData.studentIds?.map((student) => student.id),
    teachingNoteGroupId: formData.teachingNoteGroupId,
    mediaIds, // 이미지 mediaId 배열 추가
  };
}
