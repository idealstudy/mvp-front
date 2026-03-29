'use client';

import { ReactNode } from 'react';

import { Dialog } from '@/shared/components/ui/dialog';
import { Info, X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  navigation?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export const ConsultationDialogLayout = ({
  isOpen,
  onClose,
  title,
  navigation,
  children,
  footer,
}: Props) => {
  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Content className="tablet:h-[80vh] tablet:max-w-[600px] desktop:h-[602px] desktop:w-[720px] desktop:max-w-[720px] h-[85vh] max-w-[calc(100%-2rem)] gap-0 overflow-y-hidden p-6">
        <Dialog.Header className="mb-5">
          <div className="flex items-center justify-between gap-3">
            <Dialog.Title className="min-w-0 flex-1">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-7 hover:text-gray-12 shrink-0"
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="font-label-normal text-gray-7 flex items-center gap-1">
            <Info size={14} />
            작성된 내용은 학생과 보호자에게도 공유돼요.
          </Dialog.Description>
        </Dialog.Header>

        {navigation && <div className="mb-5">{navigation}</div>}

        <Dialog.Body className="min-h-0">{children}</Dialog.Body>

        {footer && (
          <Dialog.Footer className="mt-6 justify-end">{footer}</Dialog.Footer>
        )}
      </Dialog.Content>
    </Dialog>
  );
};
