import { useState } from 'react';

import { Select } from '@/app/(dashboard)/dashboard/study-rooms/_components/select';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { DialogAction } from '@/features/studyrooms/hooks/useDialogReducer';

const data = [
  {
    id: 0,
    name: '없음',
  },
  {
    id: 1,
    name: '그룹 1',
  },
  {
    id: 2,
    name: '그룹 2',
  },

  {
    id: 3,
    name: '그룹 3',
  },
];

export const GroupMoveDialog = ({
  open,
  dispatch,
}: {
  open: boolean;
  dispatch: (action: DialogAction) => void;
}) => {
  const [selectedGroup, setSelectedGroup] = useState<number>(0);

  const handleSave = () => {
    // TODO: API 호출이나 상태 업데이트 로직 넣기
    dispatch({ type: 'CLOSE' });
  };

  return (
    <Dialog
      isOpen={open}
      onOpenChange={() => dispatch({ type: 'CLOSE' })}
    >
      <Dialog.Content className="w-[598px]">
        <Dialog.Header>
          <Dialog.Title>그룹 이동하기</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="mt-6">
          <Dialog.Description className="font-headline2-heading mb-1">
            이동할 그룹
          </Dialog.Description>
          <Select
            value={selectedGroup.toString()}
            onValueChange={(value) => setSelectedGroup(Number(value))}
          >
            <Select.Trigger
              className="w-full px-6"
              data-position="right-6 text-black"
            />
            <Select.Content>
              {data.map((item) => (
                <Select.Option
                  key={item.id}
                  value={item.id.toString()}
                >
                  {item.name}
                </Select.Option>
              ))}
            </Select.Content>
          </Select>
        </Dialog.Body>
        <Dialog.Footer className="mt-6 justify-end">
          <Dialog.Close asChild>
            <Button
              variant="outlined"
              className="w-[120px]"
              size="small"
              onClick={() => dispatch({ type: 'CLOSE' })}
            >
              취소
            </Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button
              className="w-[120px]"
              size="small"
              onClick={handleSave}
            >
              저장
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
