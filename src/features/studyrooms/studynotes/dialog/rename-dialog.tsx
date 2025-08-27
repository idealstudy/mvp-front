'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { TextField } from '@/components/ui/text-field';

import { DialogAction, DialogState } from '../../hook/dialog-reducer';

export const RenameDialog = ({
  open,
  state,
  dispatch,
}: {
  open: boolean;
  state: DialogState;
  dispatch: (action: DialogAction) => void;
}) => {
  const [title, setTitle] = useState('');

  const handleSave = () => {
    // TODO: API 호출이나 상태 업데이트 로직 넣기
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
                state.type === 'rename'
                  ? state.initialTitle
                  : '제목을 입력해주세요.'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={15}
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
