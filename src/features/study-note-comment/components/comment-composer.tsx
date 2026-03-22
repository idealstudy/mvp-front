'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  getCommentProfileImageSrc,
  getCommentRoleLabel,
} from '@/entities/study-note-comment';
import {
  TextEditor,
  hasMeaningfulEditorContent,
  prepareContentForSave,
} from '@/shared/components/editor';
import { Button } from '@/shared/components/ui';
import { PRIVATE } from '@/shared/constants/route';
import { useRole } from '@/shared/hooks';
import {
  classifyStudyNoteCommentError,
  handleApiError,
} from '@/shared/lib/errors';
import { useMemberStore } from '@/store';
import { JSONContent } from '@tiptap/react';

import { useCreateComment } from '../hooks/use-comment';

interface CommentComposerProps {
  value: JSONContent;
  studyRoomId: number;
  teachingNoteId: number;
  parentCommentId: number | null;
  onChange: (value: JSONContent) => void;
  onSubmitted: () => void;
  onCancel?: () => void;
  showReplyArrow?: boolean;
  submitLabel: string;
}

export const CommentComposer = ({
  value,
  studyRoomId,
  teachingNoteId,
  parentCommentId,
  onChange,
  onSubmitted,
  onCancel,
  showReplyArrow = false,
  submitLabel,
}: CommentComposerProps) => {
  const { role } = useRole();
  const { member } = useMemberStore();
  const { mutate, isPending } = useCreateComment();
  const router = useRouter();

  const isSubmitDisabled = !hasMeaningfulEditorContent(value) || isPending;
  const profileImageSrc = getCommentProfileImageSrc(role);
  const roleLabel = getCommentRoleLabel(role);
  const authorName = member?.name ?? roleLabel;

  const onSubmit = () => {
    const { contentString, mediaIds } = prepareContentForSave(value);

    mutate(
      {
        teachingNoteId,
        data: {
          parentCommentId,
          content: contentString,
          mediaIds,
        },
      },
      {
        onSuccess: () => {
          onSubmitted();
        },
        onError: (error) => {
          handleApiError(error, classifyStudyNoteCommentError, {
            onAuth: () => {
              setTimeout(() => {
                router.replace('/login');
              }, 1500);
            },
            onContext: () => {
              setTimeout(() => {
                router.replace(PRIVATE.NOTE.LIST(studyRoomId));
              }, 1500);
            },
            onUnknown: () => {},
          });
        },
      }
    );
  };

  const composer = (
    <div className="border-gray-3 w-full rounded-sm border bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="border-gray-12 h-9 w-9 shrink-0 overflow-hidden rounded-full border">
            <Image
              src={profileImageSrc}
              alt="프로필 이미지"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center gap-1">
            <p className="font-body2-normal text-gray-12">{authorName}</p>
            {roleLabel ? (
              <>
                <p className="text-gray-7">·</p>
                <p className="font-body2-normal text-gray-7">{roleLabel}</p>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {onCancel ? (
            <Button
              variant="outlined"
              onClick={onCancel}
              className="font-label-normal disabled:font-label-normal h-[35px] shrink-0 px-6 py-2"
            >
              취소
            </Button>
          ) : null}
          <Button
            className="font-label-normal disabled:font-label-normal h-[35px] shrink-0 px-6 py-2"
            disabled={isSubmitDisabled}
            onClick={onSubmit}
          >
            {isPending ? '등록 중...' : `${submitLabel} 남기기`}
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <TextEditor
          value={value}
          onChange={onChange}
          placeholder={`${submitLabel} 내용을 입력해 주세요.`}
          targetType="TEACHING_NOTE"
          minHeight="120px"
          maxHeight="240px"
        />
      </div>
    </div>
  );

  if (!showReplyArrow) {
    return <section>{composer}</section>;
  }

  return (
    <section>
      <div className="flex items-start gap-3">
        <Image
          src="/studynotes/teacher_answer.png"
          alt="reply-arrow"
          width={32}
          height={32}
          className="mt-4 shrink-0"
        />
        {composer}
      </div>
    </section>
  );
};
