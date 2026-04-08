import { Button } from '@/shared/components/ui';
import { Dialog } from '@/shared/components/ui/dialog';
import { CircleAlert, XIcon } from 'lucide-react';

import { ConnectTagInput } from './parent-connect-tag-input';

interface ConnectDialogProps {
  onOpenChange: (open: boolean) => void;
  open?: boolean;
}

export const ConnectDialog = ({ onOpenChange, open }: ConnectDialogProps) => {
  return (
    <Dialog
      isOpen={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content className="w-[598px]">
        <Dialog.Header className="flex-row items-center justify-between">
          <Dialog.Title>학생 연결하기</Dialog.Title>
          <Dialog.Close
            asChild
            aria-label="닫기"
          >
            <button
              type="button"
              className="flex size-6 cursor-pointer items-center justify-center"
            >
              <XIcon size={24} />
            </button>
          </Dialog.Close>
        </Dialog.Header>
        <Dialog.Body className="mt-6 flex gap-3">
          <ConnectTagInput placeholder="연결할 학생의 이름, 이메일, 전화번호 등을 입력해보세요" />
          <div className="font-label-heading text-text-sub2 flex items-center gap-2">
            <CircleAlert size={24} /> 학생이 보호자 연결을 수락하면 학습 현황을
            확인할 수 있습니다.
          </div>
        </Dialog.Body>
        <Dialog.Footer className="mt-6 justify-end">
          <Button
            className="w-[120px]"
            size="xsmall"
            // onClick={handleSave}
          >
            신청하기
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
