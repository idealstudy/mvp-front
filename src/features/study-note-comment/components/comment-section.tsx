'use client';

import Image from 'next/image';

import { CommentStudentAnswer } from '@/features/study-note-comment/components/comment-student-answer';
import { CommentTeacherAnswer } from '@/features/study-note-comment/components/comment-teacher-answer';
import { ColumnLayout } from '@/layout';
import {
  TextEditor,
  hasMeaningfulEditorContent,
  useTextEditor,
} from '@/shared/components/editor';
import { Button } from '@/shared/components/ui';
import { useRole } from '@/shared/hooks';

export const StudyNoteDetailCommentSection = () => {
  const textEditor = useTextEditor();
  const isSubmitDisabled = !hasMeaningfulEditorContent(textEditor.value);

  const { role } = useRole();

  return (
    <ColumnLayout.Bottom className="space-y-4">
      <section>
        <div className="flex items-center gap-1 text-center">
          <p className="font-body1-heading text-gray-12">댓글</p>
          <p className="font-body1-heading text-orange-7">4</p>
        </div>
      </section>

      <section>
        <div className="border-gray-3 w-full rounded-sm border bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="border-gray-12 h-9 w-9 shrink-0 overflow-hidden rounded-full border">
                <Image
                  src={
                    role === 'ROLE_STUDENT'
                      ? `/character/img_profile_student01.png`
                      : `/character/img_profile_teacher01.png`
                  }
                  alt="프로필 이미지"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </div>
              {role === 'ROLE_STUDENT' ? (
                <>
                  <p className="font-body2-normal text-gray-12">이름</p>
                  <p className="text-gray-7">·</p>
                  <p className="font-body2-normal text-gray-7">학생</p>
                </>
              ) : (
                <p className="font-body2-normal text-gray-12">선생님</p>
              )}
            </div>
            <Button
              className="font-label-normal disabled:font-label-normal h-[35px] shrink-0 px-6 py-2"
              disabled={isSubmitDisabled}
            >
              댓글 남기기
            </Button>
          </div>

          <div className="mt-3">
            <TextEditor
              value={textEditor.value}
              onChange={textEditor.onChange}
              placeholder="댓글 내용을 입력해 주세요."
              targetType="TEACHING_NOTE"
              minHeight="120px"
              maxHeight="240px"
            />
          </div>
        </div>
      </section>

      <CommentStudentAnswer />

      <CommentTeacherAnswer />
    </ColumnLayout.Bottom>
  );
};
