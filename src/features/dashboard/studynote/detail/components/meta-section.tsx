'use client';

import { useReducer, useState } from 'react';

import { useRouter } from 'next/navigation';

import EllipsisIcon from '@/assets/icons/ellipsis-vertical.svg';
import { STUDY_NOTE_VISIBILITY_LABEL } from '@/features/dashboard/studynote/constant';
import {
  useParentStudyNoteDetailQuery,
  useStudyNoteDetailQuery,
} from '@/features/dashboard/studynote/detail/service/query';
import { useRemoveStudyNote } from '@/features/study-notes/hooks';
import { ColumnLayout } from '@/layout/column-layout';
import {
  StudyroomConfirmDialog,
  dialogReducer,
  initialDialogState,
} from '@/shared/components/dialog';
import { PRIVATE } from '@/shared/constants';
import { useRole } from '@/shared/hooks';
import { Check, Eye, LockKeyhole, UserRound, X } from 'lucide-react';

import { NoteMainSkeleton, NoteSideSkeleton } from './note-skeleton';

export const StudyNoteDetailMetaSection = ({
  id,
  studentId,
}: {
  id: string;
  studentId?: string;
}) => {
  const router = useRouter();

  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { role, isLoading: isRoleLoading } = useRole();
  const teachingNoteId = Number(id);
  const parentStudentId = studentId ? Number(studentId) : null;
  const hasValidParentStudentId =
    parentStudentId !== null &&
    Number.isInteger(parentStudentId) &&
    parentStudentId > 0;
  const isParent = role === 'ROLE_PARENT';
  const canManage = role === 'ROLE_TEACHER';

  const {
    data: commonNoteData,
    isPending: isCommonNotePending,
    isError: isCommonNoteError,
  } = useStudyNoteDetailQuery(teachingNoteId, {
    enabled: !isRoleLoading && !isParent,
  });

  const {
    data: parentNoteData,
    isPending: isParentNotePending,
    isError: isParentNoteError,
  } = useParentStudyNoteDetailQuery(parentStudentId ?? 0, teachingNoteId, {
    enabled: !isRoleLoading && isParent && hasValidParentStudentId,
  });

  const noteData = isParent ? parentNoteData : commonNoteData;
  const isPending =
    isRoleLoading || (isParent ? isParentNotePending : isCommonNotePending);
  const isError = isParent ? isParentNoteError : isCommonNoteError;

  const { mutate: removeNoteMutate } = useRemoveStudyNote();

  if (isParent && !hasValidParentStudentId) {
    return (
      <p className="flex flex-col items-center">
        학생 정보를 확인할 수 없어 수업노트를 불러오지 못했습니다.
      </p>
    );
  }

  if (isPending)
    return (
      <>
        <ColumnLayout.Left>
          <NoteSideSkeleton />
        </ColumnLayout.Left>
        <ColumnLayout.Right>
          <NoteMainSkeleton />
        </ColumnLayout.Right>
      </>
    );

  if (isError) {
    return (
      <p className="flex flex-col items-center">
        수업노트를 불러오는 중 오류가 발생했습니다.
      </p>
    );
  }

  if (!noteData) {
    return (
      <p className="flex flex-col items-center">등록된 수업노트가 없어요.</p>
    );
  }

  const visibilityText =
    STUDY_NOTE_VISIBILITY_LABEL[noteData.visibility] ?? noteData.visibility;
  const hasStudents = noteData.studentInfos.length > 0;

  const handleEdit = () => {
    router.push(PRIVATE.NOTE.EDIT(noteData.studyRoomId, teachingNoteId));
  };

  const handleDelete = () => {
    removeNoteMutate(
      {
        studyNoteId: teachingNoteId,
        studyRoomId: noteData.studyRoomId,
        groupId: noteData.groupId ?? null,
        // DeleteMutationVar 타입에 pageable이 필수라 전달하지만, 실제 캐시 무효화는 listPrefix(studyRoomId)로 처리되므로 값은 사용되지 않음
        pageable: { page: 0, size: 20, sortKey: 'LATEST_EDITED' },
      },
      {
        onSuccess: () => dispatch({ type: 'GO_TO_CONFIRM' }),
      }
    );
  };

  return (
    <>
      <ColumnLayout.Left className="border-line-line1 !static top-0 h-fit space-y-5 rounded-xl border bg-white p-10">
        <div className="flex items-center justify-between">
          {/* 메뉴 버튼 */}
          <div className="text-key-color-primary font-body1-normal">
            {noteData.studyRoomName}
          </div>
          {canManage && (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-text-sub2 hover:text-text-main cursor-pointer rounded p-1 transition-colors"
                aria-label="메뉴"
                data-testid="note-menu-button"
              >
                <EllipsisIcon className="h-5 w-5" />
              </button>

              {/* 드롭다운 메뉴 */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="border-line-line1 absolute top-8 right-0 z-20 w-32 overflow-hidden rounded-lg border bg-white shadow-lg">
                    <button
                      onClick={() => {
                        handleEdit();
                        setIsMenuOpen(false);
                      }}
                      className="text-text-main hover:bg-background-gray font-body2-normal w-full px-4 py-3 text-center transition-colors"
                      data-testid="note-edit-menu-item"
                    >
                      편집하기
                    </button>
                    <button
                      onClick={() =>
                        dispatch({
                          type: 'OPEN',
                          scope: 'note',
                          kind: 'delete',
                        })
                      }
                      className="text-key-color-primary hover:bg-background-gray font-body2-normal w-full px-4 py-3 text-center transition-colors"
                      data-testid="note-delete-menu-item"
                    >
                      삭제하기
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <h1 className="text-text-main font-headline1-heading">
          {noteData.title}
        </h1>

        <hr className="border-line-line1 border" />

        {/* 공개범위 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="bg-background-gray text-text-sub2 font-label-normal flex w-fit items-center gap-2 rounded-lg px-3 py-2">
              <LockKeyhole size={14} />
              <span>공개범위</span>
            </div>
            <div className="text-text-main font-body2-normal">
              {visibilityText}
            </div>
          </div>

          {/* 수업대상 */}
          {hasStudents && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="bg-background-gray text-text-sub2 font-label-normal flex w-fit items-center gap-2 rounded-lg px-3 py-2">
                  <UserRound size={14} />
                  <span>수업대상</span>
                </div>
                <div className="bg-background-gray text-text-sub2 font-label-normal flex w-fit items-center gap-2 rounded-lg px-3 py-2">
                  <Eye size={14} />
                  <span>읽음</span>
                </div>
              </div>
              <ul className="text-text-main font-body2-normal m-0 list-none space-y-1 p-0">
                {noteData.studentInfos.map((student) => (
                  <li
                    key={student.studentId}
                    className="flex justify-between"
                  >
                    <span className="justify-self-center text-center">
                      {student.studentName}
                    </span>
                    {student.readAt ? (
                      <Check
                        className="justify-self-center"
                        color="#34C759"
                        size={14}
                      />
                    ) : (
                      <X
                        className="justify-self-center"
                        color="#c73342"
                        size={14}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ColumnLayout.Left>
      {/* Dialog */}
      {dialog.status === 'open' && dialog.kind === 'delete' && (
        <StudyroomConfirmDialog
          type="delete"
          open
          dispatch={dispatch}
          onDelete={handleDelete}
          title="수업 노트를 삭제하시겠습니까?"
          description="삭제된 수업노트는 복구할 수 없습니다."
        />
      )}
      {dialog.status === 'open' && dialog.kind === 'onConfirm' && (
        <StudyroomConfirmDialog
          type="confirm"
          open
          dispatch={dispatch}
          onRefresh={() =>
            router.replace(`/study-rooms/${noteData.studyRoomId}/note`)
          }
          description="수업노트가 삭제되었습니다."
        />
      )}
    </>
  );
};
