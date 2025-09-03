import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export const DeleteDialog = ({
  open,
  onCancel,
  onConfirm,
  onOpenChange,
  title,
  description,
  handleDeleteMsg,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  handleDeleteMsg?: () => void;
}) => {
  const handleDelete = () => {
    // TODO: API 호출이나 상태 업데이트 로직 넣기
    onConfirm?.();
    handleDeleteMsg?.();
  };

  return (
    <Dialog
      isOpen={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content className="w-[598px]">
        <Dialog.Header>
          <Dialog.Title className="text-center"></Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="mt-6">
          <Dialog.Description className="font-headline1-heading text-center">
            {title}
          </Dialog.Description>
          <Dialog.Description className="font-headline2-normal mt-4 text-center">
            {description}
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer className="mt-6 justify-center">
          <Button
            className="w-[120px]"
            size="small"
            variant="outlined"
            onClick={onCancel}
          >
            취소
          </Button>

          <Button
            className="w-[120px]"
            size="small"
            variant="secondary"
            onClick={handleDelete}
          >
            삭제
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
