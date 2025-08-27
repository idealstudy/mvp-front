import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { DialogAction } from '@/features/studyrooms/hooks/useDialogReducer';

export const OnConfirmDialog = ({
  open,
  dispatch,
}: {
  open: boolean;
  dispatch: (action: DialogAction) => void;
}) => {
  return (
    <Dialog
      isOpen={open}
      onOpenChange={() => dispatch({ type: 'CLOSE' })}
    >
      <Dialog.Content className="w-[598px]">
        <Dialog.Header>
          <Dialog.Title className="text-center"></Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="mt-6">
          <Dialog.Description className="font-headline1-heading text-center font-bold">
            수업노트가 삭제되었습니다.
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer className="mt-6 justify-center">
          <Dialog.Close asChild>
            <Button
              className="w-[120px]"
              size="small"
              variant="secondary"
              onClick={() => dispatch({ type: 'CLOSE' })}
            >
              확인
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
