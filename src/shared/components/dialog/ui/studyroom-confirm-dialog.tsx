import { DialogAction } from '@/shared/components/dialog';
import { Button } from '@/shared/components/ui/button';
import { Dialog } from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';

export const StudyroomConfirmDialog = ({
  type,
  open,
  dispatch,
  title,
  description,
  onDelete,
  onConfirm,
  onRefresh,
}: {
  type: 'delete' | 'confirm';
  open: boolean;
  dispatch: (action: DialogAction) => void;
  title?: string;
  description: string;
  onDelete?: () => void;
  onConfirm?: () => void;
  onRefresh?: () => void;
}) => {
  return (
    <Dialog isOpen={open}>
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
              size="xsmall"
              variant="outlined"
              onClick={() => dispatch({ type: 'CLOSE' })}
            >
              취소
            </Button>
          )}

          <Button
            className="w-[120px]"
            size="xsmall"
            variant="secondary"
            onClick={() => {
              if (type === 'delete') {
                onDelete?.();
                return;
              }

              onConfirm?.();
              onRefresh?.();
              dispatch({ type: 'CLOSE' });
            }}
          >
            {type === 'delete' ? '삭제' : '확인'}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
