'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { TextField } from '@/components/ui/text-field';

export const InputDialog = ({
  isOpen,
  placeholder,
  onOpenChange,
  title,
  description,
  onSubmit,
  error,
}: {
  isOpen: boolean;
  placeholder: string;
  onOpenChange: () => void;
  title: string;
  description?: string;
  onSubmit: (name: string) => void;
  error?: string;
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
            {description}
          </Dialog.Description>
          <TextField error={!!error}>
            <TextField.Input
              placeholder={`${placeholder}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={15}
            />
          </TextField>
          {error && <p className="text-system-warning">{error}</p>}
        </Dialog.Body>
        <Dialog.Footer className="mt-6 justify-end">
          <Dialog.Close asChild>
            <Button
              variant="outlined"
              className="w-[120px]"
              size="xsmall"
              onClick={onOpenChange}
            >
              취소
            </Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button
              className="w-[120px]"
              size="xsmall"
              disabled={!name.trim() || !!error}
              onClick={() => onSubmit(name)}
            >
              저장
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
