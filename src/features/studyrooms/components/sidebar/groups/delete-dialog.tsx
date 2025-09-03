import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export const DeleteGroupDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content className="w-[598px]">
        <Dialog.Header>
          <Dialog.Title className="text-center"></Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="mt-6">
          <Dialog.Description className="font-headline1-heading text-center">
            수업 노트 그룹을 삭제하시겠습니까?
          </Dialog.Description>
          <Dialog.Description className="font-headline2-normal mt-4 text-center">
            삭제된 수업노트 그룹은 복구할 수 없습니다.
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer className="mt-6 justify-center">
          <Dialog.Close asChild>
            <Button
              className="w-[120px]"
              size="small"
              variant="outlined"
              onClick={onOpenChange}
            >
              취소
            </Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button
              className="w-[120px]"
              size="small"
              variant="secondary"
              onClick={onConfirm}
            >
              삭제
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
