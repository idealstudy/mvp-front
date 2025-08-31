import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Select } from '@/features/studyrooms/components/common/select';
import { DialogAction } from '@/features/studyrooms/hooks/useDialogReducer';
import { useQuery } from '@tanstack/react-query';

import {
  useDeleteStudyNoteGroup,
  useUpdateStudyNoteGroup,
} from '../services/query';
import { getStudyNoteGroupOption } from '../services/query-options';

export const GroupMoveDialog = ({
  open,
  dispatch,
  studyRoomId,
  studyNoteId,
  pageable,
  keyword,
}: {
  open: boolean;
  dispatch: (action: DialogAction) => void;
  studyRoomId: number;
  studyNoteId: number;
  pageable: { page: number; size: number; sortKey: string };
  keyword: string;
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>('none');

  const { data: studyNoteGroups } = useQuery({
    ...getStudyNoteGroupOption({
      studyRoomId: studyRoomId,
      pageable: { page: 0, size: 10, sort: ['desc'] },
    }),
  });

  const { mutate: removeStudyNoteGroup } = useDeleteStudyNoteGroup({
    studyNoteId: studyNoteId,
    studyRoomId,
    pageable,
    keyword,
  });

  const { mutate: updateStudyNoteGroup } = useUpdateStudyNoteGroup({
    teachingNoteId: studyNoteId,
    teachingNoteGroupId: Number(selectedGroup),
    studyRoomId,
    pageable,
    keyword,
  });

  const handleSave = () => {
    if (selectedGroup === null || selectedGroup === 'none') {
      removeStudyNoteGroup();
    } else {
      updateStudyNoteGroup();
      dispatch({ type: 'CLOSE' });
    }
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
            value={selectedGroup ?? ''}
            onValueChange={(value) =>
              setSelectedGroup(value === 'none' ? null : value)
            }
          >
            <Select.Trigger
              className="w-full px-6"
              data-position="right-6 text-black"
              placeholder="그룹을 선택하세요"
            />
            <Select.Content>
              <Select.Option value="none">없음</Select.Option>
              {studyNoteGroups?.content?.map((item) => (
                <Select.Option
                  key={item.id}
                  value={item.id.toString()}
                >
                  {item.title}
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
