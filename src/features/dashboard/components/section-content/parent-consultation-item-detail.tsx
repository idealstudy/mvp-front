'use client';

import { Dialog } from '@/shared/components/ui/dialog';
import { formatDateDot } from '@/shared/lib';
import { XIcon } from 'lucide-react';

interface ConsultationItemDetailProps {
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  regDate?: string;
  content?: string;
}

export const ConsultationItemDetail = ({
  open,
  onOpenChange,
  regDate,
  content,
}: ConsultationItemDetailProps) => {
  const titleDate = regDate ? formatDateDot(regDate) : '';

  return (
    <Dialog
      isOpen={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content className="h-[524px] w-[720px] max-w-[calc(100%-4rem)] p-10">
        <Dialog.Header className="flex-row items-center justify-between">
          <Dialog.Title className="font-headline1-heading text-gray-12">
            {titleDate ? `${titleDate} 기록 일지` : '기록 일지'}
          </Dialog.Title>
          <Dialog.Close
            asChild
            aria-label="닫기"
          >
            <button
              type="button"
              className="text-gray-10 flex size-6 cursor-pointer items-center justify-center"
            >
              <XIcon size={24} />
            </button>
          </Dialog.Close>
        </Dialog.Header>

        <Dialog.Body className="mt-8">
          <div className="border-line-line1 h-full rounded-[4px] border px-3 py-4">
            <div className="h-full overflow-y-auto pr-2">
              <p className="font-body2-normal text-gray-10 break-words whitespace-pre-wrap">
                {content ?? ''}
              </p>
            </div>
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  );
};
