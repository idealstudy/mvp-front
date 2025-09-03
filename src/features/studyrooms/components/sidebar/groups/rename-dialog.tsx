'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { TextField } from '@/components/ui/text-field';

export const RenameGroupDialog = ({
  isOpen,
  initialGroupName,
  onOpenChange,
}: {
  isOpen: boolean;
  initialGroupName: string;
  onOpenChange: () => void;
}) => {
  const [groupName, setGroupName] = useState('');

  const handleRenameGroup = () => {
    setGroupName('');
    onOpenChange();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content className="w-[598px]">
        <Dialog.Header>
          <Dialog.Title>수업노트 그룹 수정</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="mt-6">
          <Dialog.Description className="font-headline2-heading mb-1">
            수업노트 그룹명
          </Dialog.Description>
          <TextField>
            <TextField.Input
              placeholder={`${initialGroupName}`}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
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
              onClick={onOpenChange}
            >
              취소
            </Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button
              className="w-[120px]"
              size="small"
              disabled={!groupName.trim()}
              onClick={handleRenameGroup}
            >
              저장
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
