'use client';

import { useState } from 'react';

import Image from 'next/image';

import { ConsultationDetail, consultationKeys } from '@/entities/consultation';
import { useDeleteConsultationAnswer } from '@/features/consultation/hooks/use-answer-form';
import { useTeacherProfile } from '@/features/consultation/hooks/use-teacher-profile';
import { ConfirmDialog } from '@/shared/components/dialog';
import { TextViewer, parseEditorContent } from '@/shared/components/editor';
import { DropdownMenu } from '@/shared/components/ui';
import { classifyConsultationError, handleApiError } from '@/shared/lib/errors';
import { useQueryClient } from '@tanstack/react-query';

export default function ConsultationAnswerView({
  consultation,
  isTargetTeacher,
  onEdit,
}: {
  consultation: ConsultationDetail;
  isTargetTeacher: boolean;
  onEdit: () => void;
}) {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: teacherProfile } = useTeacherProfile(
    consultation.targetTeacherId
  );

  const deleteConsultationAnswerMutation = useDeleteConsultationAnswer(
    consultation.id
  );

  if (!consultation.answer) return null;

  const content = parseEditorContent(
    consultation.answer.resolvedContent.content
  );

  // 답변 삭제
  const handleDeleteAnswer = () => {
    deleteConsultationAnswerMutation.mutate(undefined, {
      onSuccess: () => setIsDeleteDialogOpen(false),
      onError: (error) => {
        handleApiError(error, classifyConsultationError, {
          // INQUIRY_NOT_FOUND, INQUIRY_ANSWER_NOT_FOUND, INQUIRY_ANSWER_FORBIDDEN
          onContext: () => {
            setIsDeleteDialogOpen(false);
            queryClient.invalidateQueries({
              queryKey: consultationKeys.detail(consultation.id),
            });
          },
        });
      },
    });
  };

  return (
    <>
      <div className="border-line-line1 mt-4 h-fit w-full rounded-xl border bg-white px-8 py-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-row items-center justify-between">
            {/* 프로필 */}
            <div className="flex flex-row items-center gap-3">
              <div className="bg-gray-scale-gray-10 h-10 w-10 rounded-full" />
              <span className="font-body2-heading">
                {teacherProfile?.name ? `${teacherProfile.name} 선생님` : null}
              </span>
            </div>

            {/* 수정/삭제 메뉴 */}
            {isTargetTeacher && (
              <DropdownMenu
                open={isDropdownMenuOpen}
                onOpenChange={setIsDropdownMenuOpen}
              >
                <DropdownMenu.Trigger className="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100">
                  <Image
                    src="/studynotes/gray-kebab.svg"
                    width={24}
                    height={24}
                    alt="더보기"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="flex min-w-[110px] flex-col items-stretch">
                  <DropdownMenu.Item
                    className="justify-center"
                    onClick={() => {
                      setIsDropdownMenuOpen(false);
                      onEdit();
                    }}
                  >
                    수정
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="justify-center"
                    variant="danger"
                    onClick={() => {
                      setIsDropdownMenuOpen(false);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    삭제
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            )}
          </div>

          {/* 답변 내용 */}
          <TextViewer value={content} />

          {/* 작성일 */}
          {consultation.answer.regDate && (
            <span className="font-caption-normal text-text-sub2 self-end">
              {consultation.answer.regDate.split('T')[0]} 작성
            </span>
          )}
        </div>
      </div>

      {/* 삭제 확인 Dialog */}
      <ConfirmDialog
        variant="delete"
        emphasis="title-strong"
        open={isDeleteDialogOpen}
        dispatch={(action) => {
          if (action.type === 'CLOSE') setIsDeleteDialogOpen(false);
        }}
        onConfirm={handleDeleteAnswer}
        pending={deleteConsultationAnswerMutation.isPending}
        title="답변을 삭제하시겠습니까?"
        description="삭제된 답변은 복구할 수 없습니다."
      />
    </>
  );
}
