'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { TextField } from '@/components/ui/text-field';
import {
  DialogAction,
  DialogState,
} from '@/features/studyrooms/hooks/useDialogReducer';

import {
  useStudyNoteDetailsQuery,
  useUpdateStudyNote,
} from '../services/query';

export const RenameDialog = ({
  open,
  state,
  dispatch,
  studyNoteId,
}: {
  open: boolean;
  state: DialogState;
  dispatch: (action: DialogAction) => void;
  studyNoteId: number;
}) => {
  const [title, setTitle] = useState('');

  const { data: studyNoteDetails } = useStudyNoteDetailsQuery({
    teachingNoteId: studyNoteId,
  });

  const { mutate: updateStudyNote } = useUpdateStudyNote({
    teachingNoteId: studyNoteId,
    studyRoomId: studyNoteDetails?.data?.studyRoomId || 0,
    teachingNoteGroupId: studyNoteDetails?.data?.teachingNoteGroupId || 0,
    title: title,
    content: studyNoteDetails?.data?.content || '',
    visibility: studyNoteDetails?.data?.visibility || '',
    taughtAt: studyNoteDetails?.data?.taughtAt || '',
    studentIds:
      studyNoteDetails?.data?.studentInfos?.map(
        (info: { studentId: number }) => info.studentId
      ) || [],
  });

  const handleSave = () => {
    updateStudyNote();
    dispatch({ type: 'CLOSE' });
  };

  return (
    <Dialog
      isOpen={open}
      onOpenChange={() => dispatch({ type: 'CLOSE' })}
    >
      <Dialog.Content className="w-[598px]">
        <Dialog.Header>
          <Dialog.Title>제목 수정하기</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="mt-6">
          <Dialog.Description className="font-headline2-heading mb-1">
            수업노트 제목
          </Dialog.Description>
          <TextField>
            <TextField.Input
              placeholder={
                state.status === 'open' && state.payload?.initialTitle
                  ? state.payload.initialTitle
                  : '제목을 입력해주세요.'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={30}
            />
          </TextField>
        </Dialog.Body>
        <Dialog.Footer className="mt-6 justify-end">
          <Dialog.Close asChild>
            <Button
              variant="outlined"
              className="w-[120px]"
              size="small"
              onClick={() => dispatch({ type: 'CLOSE' })}
            >
              취소
            </Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button
              className="w-[120px]"
              size="small"
              disabled={!title.trim()}
              onClick={handleSave}
            >
              저장
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
