'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Dialog } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib';
import { X } from 'lucide-react';

type LinkDialogProps = {
  isOpen: boolean;
  initialText: string;
  initialUrl: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { text: string; url: string }) => void;
};

export const LinkDialog = ({
  isOpen,
  initialText,
  initialUrl,
  onOpenChange,
  onSubmit,
}: LinkDialogProps) => {
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    if (!isOpen) return;
    setText(initialText);
    setUrl(initialUrl);
  }, [isOpen, initialText, initialUrl]);

  const trimmedUrl = url.trim();
  const disabled = trimmedUrl.length === 0;

  const handleSubmit = () => {
    if (disabled) return;
    onSubmit({ text: text.trim(), url: trimmedUrl });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content className="w-[560px] p-8">
        <Dialog.Header className="flex-row items-start justify-between gap-3">
          <Dialog.Title>링크 연결하기</Dialog.Title>
          <Dialog.Close
            asChild
            aria-label="닫기"
          >
            <button
              type="button"
              className={cn(
                'text-gray-scale-gray-40 hover:text-text-main flex size-6 items-center justify-center'
              )}
            >
              <X size={20} />
            </button>
          </Dialog.Close>
        </Dialog.Header>
        <Dialog.Body className="mt-8 gap-6">
          <div className="space-y-2">
            <label className="font-body2-heading text-text-main block">
              표시할 텍스트
            </label>
            <Input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="화면에 보여질 텍스트를 입력해주세요."
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <label className="font-body2-heading text-text-main block">
              링크
            </label>
            <Input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="텍스트를 클릭하면 이동할 URL을 입력해주세요."
              autoFocus
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>
        </Dialog.Body>
        <Dialog.Footer className="mt-8 justify-end">
          <Dialog.Close asChild>
            <Button
              variant="outlined"
              size="xsmall"
              className="w-[102px]"
            >
              취소
            </Button>
          </Dialog.Close>
          <Button
            size="xsmall"
            className="w-[102px]"
            disabled={disabled}
            onClick={handleSubmit}
          >
            저장
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
