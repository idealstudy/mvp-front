'use client';

import { useReducer } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { InputDialog } from '@/features/studyrooms/components/common/dialog/input-dialog';
import {
  dialogReducer,
  initialDialogState,
} from '@/features/studyrooms/hooks/useDialogReducer';

export const InviteButton = () => {
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);
  return (
    <>
      {dialog.status === 'open' && dialog.kind === 'invite' && (
        <InputDialog
          isOpen={true}
          placeholder="초대할 학생의 이메일을 입력해주세요."
          onOpenChange={() => dispatch({ type: 'CLOSE' })}
          title="학생 초대"
          description="초대할 학생의 이메일을 입력해주세요."
          onSubmit={() => {}}
        />
      )}
      <Button
        className="bg-orange-scale-orange-1 border-key-color-primary hover:bg-orange-scale-orange-10 flex w-full items-center justify-center gap-1 rounded-[8px]"
        onClick={() =>
          dispatch({ type: 'OPEN', scope: 'invite', kind: 'invite' })
        }
      >
        <Image
          src="/studyroom/ic-invite.png"
          alt="invite-student"
          width={24}
          height={24}
          className="mb-1"
        />
        <span className="font-body2-normal text-key-color-primary">
          학생 초대
        </span>
      </Button>
    </>
  );
};
