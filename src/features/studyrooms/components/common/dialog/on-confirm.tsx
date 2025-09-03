import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { DialogAction } from '@/features/studyrooms/hooks/useDialogReducer';

export const OnConfirmDialog = ({
  open,
  dispatch,
  title,
  description,
}: {
  open: boolean;
  dispatch: (action: DialogAction) => void;
  title?: string;
  description: string;
}) => {
  return (
    <Dialog
      isOpen={open}
      onOpenChange={() => dispatch({ type: 'CLOSE' })}
    >
      <Dialog.Content className="w-[598px]">
        <Dialog.Header>
          <Dialog.Title className="text-center">{title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="mt-6">
          <Dialog.Description className="font-headline1-heading text-center font-bold">
            {description}
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
