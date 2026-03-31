import { Button } from '@/shared/components/ui';
import { Dialog } from '@/shared/components/ui/dialog';
import { AlertCircle } from 'lucide-react';

type Props = {
  date: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
};

export const DeleteConfirm = ({
  date,
  isOpen,
  onOpenChange,
  onDelete,
}: Props) => {
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content className="z-[60] w-[400px] items-center gap-0 p-5 text-center">
        <div className="bg-orange-1 mx-auto my-6 flex h-12 w-12 items-center justify-center rounded-full">
          <AlertCircle
            className="text-orange-6"
            size={24}
          />
        </div>
        <Dialog.Title className="font-body1-heading text-gray-12 mb-2">
          {date} 기록 일지를 삭제하시겠습니까?
        </Dialog.Title>
        <Dialog.Description className="font-body2-normal text-gray-7">
          기록 일지를 삭제하면 영구적으로 삭제되어
          <br /> 복구할 수 없습니다.
        </Dialog.Description>
        <Dialog.Footer className="mt-6 w-full">
          <Dialog.Close asChild>
            <Button
              variant="outlined"
              size="large"
              className="w-full"
            >
              취소
            </Button>
          </Dialog.Close>
          <Button
            variant="primary"
            size="large"
            className="w-full"
            onClick={onDelete}
          >
            확인
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

export default DeleteConfirm;
