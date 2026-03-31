'use client';

import { useState } from 'react';

import Image from 'next/image';

import {
  useRemoveMember,
  useResumeMember,
  useTerminateMember,
} from '@/features/study-rooms/hooks';
import {
  DialogAction,
  StudyroomConfirmDialog,
} from '@/shared/components/dialog';
import { DropdownMenu } from '@/shared/components/ui';

type Props = {
  studyRoomId: number;
  memberId: string;
  isTerminated: boolean;
};

export default function MembersDropdown({
  studyRoomId,
  memberId,
  isTerminated,
}: Props) {
  const { mutate: removeMember } = useRemoveMember();
  const { mutate: terminateMember } = useTerminateMember();
  const { mutate: resumeMember } = useResumeMember();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const dispatch = (action: DialogAction) => {
    if (action.type === 'CLOSE') setConfirmOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger>
          <Image
            src="/studynotes/gray-kebab.svg"
            width={24}
            height={24}
            alt="더보기"
            className="h-7 w-7 cursor-pointer"
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item
            onSelect={() =>
              isTerminated
                ? resumeMember({ studyRoomId, studentId: Number(memberId) })
                : terminateMember({ studyRoomId, studentId: Number(memberId) })
            }
          >
            {isTerminated ? '수업 재개하기' : '수업 종료하기'}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            variant="danger"
            onSelect={() => setConfirmOpen(true)}
          >
            학생 내보내기
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>

      {/* 다이얼로그 */}
      <StudyroomConfirmDialog
        type="delete"
        open={confirmOpen}
        dispatch={dispatch}
        title="스터디룸에서 내보내시겠습니까?"
        description="필요할 경우, 다시 초대할 수 있습니다."
        onDelete={() =>
          removeMember(
            { studyRoomId, studentId: Number(memberId) },
            { onSuccess: () => setConfirmOpen(false) }
          )
        }
      />
    </>
  );
}
