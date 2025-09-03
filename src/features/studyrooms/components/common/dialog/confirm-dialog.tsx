import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { DialogAction } from '@/features/studyrooms/hooks/useDialogReducer';
import { cn } from '@/lib/utils';

export const ConfirmDialog = ({
  type,
  open,
  dispatch,
  title,
  description,
  onDelete,
}: {
  type: 'delete' | 'confirm';
  open: boolean;
  dispatch: (action: DialogAction) => void;
  title?: string;
  description: string;
  onDelete?: () => void;
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
          <Dialog.Description className="font-headline1-heading text-center">
            {title}
          </Dialog.Description>
          <Dialog.Description
            className={cn(
              'font-headline2-normal mt-4 text-center',
              type === 'confirm' && 'font-headline1-heading font-bold'
            )}
          >
            {description}
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer className="mt-6 justify-center">
          {type === 'delete' && (
            <Button
              className="w-[120px]"
              size="small"
              variant="outlined"
              onClick={() => dispatch({ type: 'CLOSE' })}
            >
              취소
            </Button>
          )}

          <Button
            className="w-[120px]"
            size="small"
            variant="secondary"
            onClick={
              type === 'delete' ? onDelete : () => dispatch({ type: 'CLOSE' })
            }
          >
            {type === 'delete' ? '삭제' : '확인'}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
