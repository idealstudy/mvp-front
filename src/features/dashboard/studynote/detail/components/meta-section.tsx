'use client';

import { useReducer, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import EllipsisIcon from '@/assets/icons/ellipsis-vertical.svg';
import { useStudyNoteDetailQuery } from '@/features/dashboard/studynote/detail/service/query';
import { useRemoveStudyNote } from '@/features/study-notes/hooks';
import { ColumnLayout } from '@/layout/column-layout';
import {
  StudyroomConfirmDialog,
  dialogReducer,
  initialDialogState,
} from '@/shared/components/dialog';
import { useRole } from '@/shared/hooks';

const StudyNoteDetailMetaSection = ({ id }: { id: string }) => {
  const router = useRouter();

  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { role } = useRole();
  const canManage = role === 'ROLE_TEACHER';

  const { data } = useStudyNoteDetailQuery(Number(id));

  const { mutate: removeNoteMutate } = useRemoveStudyNote();

  if (!data) return null;

  const visibilityText =
    data.visibility === 'PUBLIC' ? '수업대상 공개' : '수업대상 비공개';

  const handleEdit = () => {
    // 편집 페이지로 이동
    router.push(`/study-rooms/${data.studyRoomId}/note/${id}/edit`);
  };

  const handleDelete = () => {
    removeNoteMutate(
      {
        studyNoteId: Number(id),
        studyRoomId: data.studyRoomId,
        groupId: data.groupId ?? null,
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
            {data.studyRoomName}
          </div>
          {canManage && (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-text-sub2 hover:text-text-main cursor-pointer rounded p-1 transition-colors"
                aria-label="메뉴"
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
                    >
                      삭제하기
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <h1 className="text-text-main font-headline1-heading">{data.title}</h1>
        <hr className="border-line-line1 border" />
        <div className="space-y-4">
          {/* 공개범위 */}
          <div className="space-y-2">
            <div className="bg-background-gray text-text-sub2 font-label-normal flex w-fit items-center gap-2 rounded-lg px-3 py-2">
              <Image
                src="/studynotes/lock.svg"
                alt="lock"
                width={14}
                height={14}
              />
              <span>공개범위</span>
            </div>
            <div className="text-text-main font-body2-normal">
              {visibilityText}
            </div>
          </div>

          {/* 수업대상 */}
          {data.studentInfos.length > 0 && (
            <div className="space-y-2">
              <div className="bg-background-gray text-text-sub2 font-label-normal flex w-fit items-center gap-2 rounded-lg px-3 py-2">
                <Image
                  src="/studynotes/person.svg"
                  alt="person"
                  width={14}
                  height={14}
                />
                <span>수업대상</span>
              </div>
              <div className="text-text-main font-body2-normal space-y-1">
                {data.studentInfos.map((student, index) => (
                  <span key={student.studentId}>
                    {student.studentName}
                    {index < data.studentInfos.length - 1 && ' '}
                  </span>
                ))}
              </div>
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
            router.replace(`/study-rooms/${data.studyRoomId}/note`)
          }
          description="수업노트가 삭제되었습니다."
        />
      )}
    </>
  );
};

export default StudyNoteDetailMetaSection;
