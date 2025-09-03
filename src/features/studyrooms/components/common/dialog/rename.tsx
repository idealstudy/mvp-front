'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { TextField } from '@/components/ui/text-field';

export const RenameDialog = ({
  isOpen,
  initialName,
  onOpenChange,
  title,
  handleRename,
}: {
  isOpen: boolean;
  initialName: string;
  onOpenChange: () => void;
  title: string;
  handleRename: () => void;
}) => {
  const [name, setName] = useState('');

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content className="w-[598px]">
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="mt-6">
          <Dialog.Description className="font-headline2-heading mb-1">
            {title}
          </Dialog.Description>
          <TextField>
            <TextField.Input
              placeholder={`${initialName}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              disabled={!name.trim()}
              onClick={handleRename}
            >
              저장
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
