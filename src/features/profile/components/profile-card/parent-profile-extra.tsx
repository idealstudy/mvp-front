'use client';

import { useState } from 'react';

import Image from 'next/image';

import {
  useConnectionList,
  useDeleteConnection,
} from '@/features/dashboard/connect/hooks/use-connection';
import { ConfirmDialog, DialogAction } from '@/shared/components/dialog';
import { MiniSpinner } from '@/shared/components/loading';
import { X } from 'lucide-react';

export default function ParentProfileExtra() {
  const baseQuery = {
    page: 0,
    size: 10,
    sort: ['acceptedDate,DESC'],
  };

  const { data, isLoading } = useConnectionList(baseQuery);
  const { mutate: deleteConnection, isPending } = useDeleteConnection();

  const [selectedConnectionId, setSelectedConnectionId] = useState<
    number | null
  >(null);

  const [studentName, setStudentName] = useState<string | null>(null);

  if (isLoading) return <MiniSpinner />;

  const connectionList = data?.connectionList ?? [];
  const isDialogOpen = selectedConnectionId !== null;

  const closeDialog = () => setSelectedConnectionId(null);

  const dialogDispatch = (action: DialogAction) => {
    if (action.type === 'CLOSE') {
      closeDialog();
    }
  };

  const handleConfirmDelete = () => {
    if (selectedConnectionId === null) return;

    deleteConnection(selectedConnectionId, {
      onSuccess: closeDialog,
    });
  };

  return (
    <div>
      <h4 className="font-body1-heading mb-2">연결된 학생 목록</h4>

      {connectionList.length === 0 ? (
        <p className="text-text-sub2 font-body2-normal">
          연결된 학생이 없습니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {connectionList.map((connection) => (
            <li
              key={connection.id}
              className="border-line-line2 flex items-center justify-between rounded-md border px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-2">
                <div className="bg-background-gray relative size-8 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src="/character/img_profile_student01.png"
                    alt="프로필 이미지"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>

                <span className="font-body2-normal truncate">
                  {connection.opponent.name}
                </span>
              </div>

              <button
                type="button"
                aria-label={`${connection.opponent.name} 연결 해제`}
                className="text-text-sub2 hover:text-text-main shrink-0 cursor-pointer"
                onClick={() => {
                  setSelectedConnectionId(connection.id);
                  setStudentName(connection.opponent.name);
                }}
              >
                <X size={20} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        dispatch={dialogDispatch}
        open={isDialogOpen}
        title={`${studentName} 학생과의 연결을 취소하시겠습니까?`}
        description="나중에 학생을 다시 연결할 수 있습니다."
        variant="confirm-cancel"
        pending={isPending}
        onConfirm={handleConfirmDelete}
        onCancel={closeDialog}
      />
    </div>
  );
}
