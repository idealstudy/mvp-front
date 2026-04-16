'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';

import { useCreateInquiry } from '@/features/inquiry/hooks/use-inquiry-form';
import { useTeacherProfile } from '@/features/inquiry/hooks/use-teacher-profile';
import { useTeacherStudyRooms } from '@/features/inquiry/hooks/use-teacher-study-rooms';
import {
  InquiryForm,
  InquiryFormSchema,
} from '@/features/inquiry/schema/schema';
import { ConfirmDialog } from '@/shared/components/dialog';
import {
  TextEditor,
  initialTextEditorValue,
  prepareContentForSave,
} from '@/shared/components/editor';
import {
  Button,
  Form,
  Input,
  RequiredMark,
  Select,
} from '@/shared/components/ui';
import { PUBLIC } from '@/shared/constants';
import { cn, extractText } from '@/shared/lib';
import { classifyInquiryError, handleApiError } from '@/shared/lib/errors';
import { useMemberStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { JSONContent } from '@tiptap/react';

// 이미지 업로드 중 버튼 비활성화
const hasUploadingNode = (node: JSONContent): boolean => {
  if (node.attrs?.isUploading === true) return true;
  return (node.content ?? []).some(hasUploadingNode);
};

export default function InquiryWriteArea({
  teacherId,
  studyRoomId,
  isEditMode,
}: {
  teacherId: number;
  studyRoomId?: number;
  isEditMode?: boolean;
}) {
  const DRAFT_KEY = `inquiry-draft-${studyRoomId ?? 'none'}-${teacherId}`;

  const router = useRouter();
  const member = useMemberStore((state) => state.member);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [roomSelectValue, setRoomSelectValue] = useState(
    studyRoomId ? String(studyRoomId) : ''
  );

  const createInquiryMutation = useCreateInquiry();

  // TODO update 추가
  const mutation = isEditMode ? createInquiryMutation : createInquiryMutation;

  // 스터디룸 목록
  const { data: studyRooms } = useTeacherStudyRooms(teacherId);
  // 선생님 정보
  const { data: teacherProfile } = useTeacherProfile(teacherId);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<InquiryForm>({
    resolver: zodResolver(InquiryFormSchema),
    defaultValues: {
      teacherId,
      studyRoomId,
      title: '',
      content: initialTextEditorValue,
    },
    mode: 'onChange',
  });

  // 이미지 업로드 중 버튼 비활성화
  const content = watch('content');
  const isUploading = useMemo(() => hasUploadingNode(content), [content]);

  useEffect(() => {
    if (member?.role === 'ROLE_TEACHER') {
      toast.error('선생님은 수업 문의를 남길 수 없습니다.', {
        toastId: 'teacher-inquiry-blocked',
      });
      setTimeout(() => router.replace('/dashboard'), 1500);
    }
  }, [member, router]);

  // 저장된 제목과 본문 내용 가져오기 (sessionStorage)
  useEffect(() => {
    const savedTitle = sessionStorage.getItem(`${DRAFT_KEY}-title`) ?? '';
    const savedContent = sessionStorage.getItem(`${DRAFT_KEY}-content`);

    if (savedTitle)
      setValue('title', savedTitle, {
        shouldDirty: true,
        shouldValidate: true,
      });
    if (savedContent)
      setValue('content', JSON.parse(savedContent), {
        shouldDirty: true,
        shouldValidate: true,
      });

    sessionStorage.removeItem(`${DRAFT_KEY}-title`);
    sessionStorage.removeItem(`${DRAFT_KEY}-content`);
  }, [setValue, DRAFT_KEY]);

  // 페이지 이탈 시 안내
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const onSubmit = (data: InquiryForm) => {
    // 비로그인 시, 로그인으로 이동
    if (!member) {
      sessionStorage.setItem(`${DRAFT_KEY}-title`, data.title);
      sessionStorage.setItem(
        `${DRAFT_KEY}-content`,
        JSON.stringify(data.content)
      );
      setIsLoginModalOpen(true);
      return;
    }

    const { contentString, mediaIds } = prepareContentForSave(data.content);

    mutation.mutate(
      {
        targetTeacherId: data.teacherId,
        studyRoomId: data.studyRoomId,
        title: data.title,
        content: contentString,
        mediaIds,
      },
      {
        onError: (error) => {
          handleApiError(error, classifyInquiryError, {
            // INQUIRY_NOT_FOUND, STUDY_ROOM_NOT_EXIST
            onContext: () => {
              setTimeout(() => {
                router.back();
              }, 1500);
            },
          });
        },
      }
    );
  };

  return (
    <>
      <div className="border-line-line1 mt-4 h-fit w-full rounded-xl border bg-white px-8 py-10">
        <h1 className="font-title-heading mb-10">
          어떤 내용을 문의하시겠어요?
        </h1>

        <Form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          {/* 제목 */}
          <Form.Item error={!!errors.title}>
            <Form.Label className="font-body1-heading mb-2">
              문의 제목 <RequiredMark />
            </Form.Label>
            <Form.Control>
              <Input
                {...register('title')}
                placeholder="문의 제목을 입력해주세요."
                disabled={mutation.isPending}
              />
            </Form.Control>
            <Form.ErrorMessage className="text-sm">
              {errors.title?.message}
            </Form.ErrorMessage>
          </Form.Item>

          {/* 스터디룸 */}
          {studyRooms && studyRooms.length > 0 && (
            <Form.Item>
              <Form.Label className="font-body1-heading mb-2">
                스터디룸
              </Form.Label>
              <Form.Control>
                <Controller
                  name="studyRoomId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={roomSelectValue}
                      onValueChange={(v) => {
                        setRoomSelectValue(v);
                        field.onChange(v === 'none' ? undefined : Number(v));
                      }}
                      disabled={mutation.isPending}
                    >
                      <Select.Trigger
                        placeholder="스터디룸을 선택해주세요."
                        className="border-line-line2"
                      />
                      <Select.Content className="border-line-line2 max-h-40 overflow-y-auto">
                        <Select.Option value="none">
                          스터디룸 없이 문의
                        </Select.Option>
                        {studyRooms.map((room) => (
                          <Select.Option
                            key={room.id}
                            value={room.id.toString()}
                          >
                            {room.name}
                          </Select.Option>
                        ))}
                      </Select.Content>
                    </Select>
                  )}
                />
              </Form.Control>
            </Form.Item>
          )}

          {/* 선생님 (문의 대상) */}
          <Form.Item>
            <Form.Label className="font-body1-heading mb-2">
              문의 대상 <RequiredMark />
            </Form.Label>
            <Input
              value={
                teacherProfile?.name ? `${teacherProfile?.name} 선생님` : ''
              }
              readOnly
              disabled
            />
          </Form.Item>

          {/* 내용 */}
          <Form.Item error={!!errors.content}>
            <Form.Label className="font-body1-heading">
              문의 내용 <RequiredMark />
            </Form.Label>
            <Form.Control>
              <Controller
                name="content"
                control={control}
                render={({ field }) => {
                  const text = extractText(JSON.stringify(field.value));
                  const length = text.length;
                  return (
                    <>
                      <TextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="문의 내용을 입력해주세요."
                        minHeight="400px"
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-system-warning text-sm">
                          {typeof errors.content?.message === 'string' &&
                            errors.content.message}
                        </p>
                        <span
                          className={cn(
                            length > 3000
                              ? 'text-system-warning'
                              : 'text-gray-5'
                          )}
                        >
                          {length} / 3000
                        </span>
                      </div>
                    </>
                  );
                }}
              />
            </Form.Control>
          </Form.Item>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            disabled={mutation.isPending || !isDirty || !isValid || isUploading}
            className="self-end"
          >
            {mutation.isPending ? '저장 중' : '문의 남기기'}
          </Button>
        </Form>
      </div>

      {/* 로그인 이동 안내 Dialog */}
      <ConfirmDialog
        variant="confirm-cancel"
        open={isLoginModalOpen}
        dispatch={(action) => {
          if (action.type === 'CLOSE') setIsLoginModalOpen(false);
        }}
        emphasis="title-strong"
        onConfirm={() => {
          const from = encodeURIComponent(
            PUBLIC.INQUIRY.CREATE(teacherId, studyRoomId)
          );
          router.replace(`${PUBLIC.CORE.LOGIN}?from=${from}`);
        }}
        onCancel={() => setIsLoginModalOpen(false)}
        title="로그인이 필요해요"
        description="작성 중인 내용은 로그인 후 이어서 작성할 수 있어요."
        confirmText="로그인하기"
        cancelText="취소"
      />
    </>
  );
}
