'use client';

import { useEffect, useReducer, useState } from 'react';

import Image from 'next/image';

import StudynotesItem from '@/features/profile/components/teacher/studynotes-item';
import { StudyNote } from '@/features/study-notes/model';
import { dialogReducer, initialDialogState } from '@/shared/components/dialog';
import { Button, Dialog, Input } from '@/shared/components/ui';

const STUDY_NOTES: StudyNote[] = [
  {
    id: 1,
    groupId: 1,
    groupName: 'group name',
    teacherName: '김에듀 강사',
    title: '수업노트 1',
    visibility: 'PUBLIC',
    taughtAt: '2025-12-27',
    updatedAt: '2025-12-29',
  },
  {
    id: 2,
    groupId: 2,
    groupName: 'group name2',
    teacherName: '김에듀 강사',
    title: '수업노트 2',
    visibility: 'SPECIFIC_STUDENTS_ONLY',
    taughtAt: '2026-02-02',
    updatedAt: '2026-02-05',
  },
];

export default function SelectStudynotesDialog() {
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (dialog.status === 'open') {
      setSelectedIds(new Set());
    }
  }, [dialog.status]);

  const toggleNote = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= 5) return prev;
        next.add(id);
      }
      return next;
    });
  };

  return (
    <>
      <button
        onClick={() =>
          dispatch({
            type: 'OPEN',
            scope: 'note',
            kind: 'select-representative',
          })
        }
        className="cursor-pointer"
      >
        <Image
          src={'/common/settings.svg'}
          alt="대표 수업노트 설정"
          width={20}
          height={20}
        />
      </button>

      <Dialog
        isOpen={dialog.status === 'open'}
        onOpenChange={() => dispatch({ type: 'CLOSE' })}
      >
        <Dialog.Content className="flex h-150 max-w-200 flex-col gap-6">
          <Dialog.Header>
            <div className="max-desktop:flex-col flex items-center gap-2">
              <Dialog.Title>대표 수업노트 선택</Dialog.Title>
              <Dialog.Description className="font-caption-normal text-text-sub2 flex gap-1">
                <Image
                  src={'/common/info.svg'}
                  alt="선택 안내"
                  width={12}
                  height={12}
                />
                <span>대표 수업노트는 5개까지 선택가능해요!</span>
              </Dialog.Description>
            </div>
          </Dialog.Header>
          <Dialog.Body>
            <Input />
            <div className="space-y-3 overflow-y-auto px-3 py-4">
              {STUDY_NOTES.map((studynote) => (
                <StudynotesItem
                  variant="selectable"
                  key={studynote.id}
                  studynote={studynote}
                  checked={selectedIds.has(studynote.id)}
                  onClick={() => toggleNote(studynote.id)}
                />
              ))}
            </div>
          </Dialog.Body>
          <Dialog.Footer className="self-end">
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="outlined"
                size="small"
              >
                취소
              </Button>
            </Dialog.Close>
            <Button
              type="button"
              variant="primary"
              size="small"
              // TODO disabled 처리
              disabled={false}
            >
              저장
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
