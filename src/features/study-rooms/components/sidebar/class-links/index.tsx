import { useReducer, useState } from 'react';

import { dialogReducer } from '@/shared/components/dialog/model/dialog-reducer';
import { PlusIcon } from '@/shared/components/icons';
import { LinkIcon } from '@/shared/components/icons';
import { DropdownMenu } from '@/shared/components/ui';
import { EllipsisVertical } from 'lucide-react';

import { StudyroomClassLinksAlertDialog } from './alert-dialog';
import { StudyroomClassLinksDeleteDialog } from './delete-dialog';
import { StudyroomClassLinksInputDialog } from './input-dialog';

const MOCK_LINKS = [
  {
    id: 1,
    name: '에듀고등학교 비대면 바로가기에듀고등학교 비대면 바로가기',
    url: 'https://zoom.us/j/123456789',
  },
  {
    id: 2,
    name: '에듀 비대면 바로가기',
    url: 'https://zoom.us/j/234567890',
  },
  {
    id: 3,
    name: '에듀 비대면 바로가기',
    url: 'https://zoom.us/j/345678901',
  },
  {
    id: 4,
    name: '에듀 비대면 바로가기',
    url: 'https://zoom.us/j/456789012',
  },
  {
    id: 5,
    name: '에듀 비대면 바로가기',
    url: 'https://zoom.us/j/567890123',
  },
];

export const StudyRoomClassLinks = ({ canManage }: { canManage: boolean }) => {
  const [dialog, dispatch] = useReducer(dialogReducer, {
    status: 'idle',
  });
  const [selectedLink, setSelectedLink] = useState<{
    id: number;
    name: string;
    url: string;
  } | null>(null);

  return (
    <div className="flex flex-col">
      {dialog.status === 'open' &&
        dialog.kind === 'create' &&
        dialog.scope === 'studyroom' && (
          <StudyroomClassLinksInputDialog
            isOpen={true}
            defaultName={selectedLink?.name}
            defaultUrl={selectedLink?.url}
            onClose={() => {
              setSelectedLink(null);
              dispatch({ type: 'CLOSE' });
            }}
            onConfirm={() => {
              setSelectedLink(null);
              dispatch({ type: 'CLOSE' });
            }}
          />
        )}

      {dialog.status === 'open' &&
        dialog.kind === 'alert' &&
        dialog.scope === 'studyroom' && (
          <StudyroomClassLinksAlertDialog
            isOpen={true}
            onClose={() => dispatch({ type: 'CLOSE' })}
          />
        )}

      {dialog.status === 'open' &&
        dialog.kind === 'delete' &&
        dialog.scope === 'studyroom' && (
          <StudyroomClassLinksDeleteDialog
            isOpen={true}
            onClose={() => dispatch({ type: 'CLOSE' })}
            onConfirm={() => dispatch({ type: 'CLOSE' })}
          />
        )}

      <div className="flex h-9 items-center justify-between">
        <p className="text-gray-12 font-body1-heading text-center">
          수업 바로가기 링크
        </p>
        {canManage && (
          <button
            className="hover:bg-gray-scale-gray-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px]"
            onClick={() =>
              dispatch({
                type: 'OPEN',
                scope: 'studyroom',
                kind: MOCK_LINKS.length >= 5 ? 'alert' : 'create',
              })
            }
          >
            <PlusIcon />
          </button>
        )}
      </div>
      {MOCK_LINKS.length === 0 && canManage && (
        <p className="text-gray-5 font-body2-normal flex items-center">
          <PlusIcon /> 버튼으로 링크를 추가해보세요.
        </p>
      )}

      {MOCK_LINKS.length > 0 && (
        <ul className="flex flex-col rounded-md bg-[#E9F5FF] px-6 py-4.5">
          {MOCK_LINKS.map((link) => (
            <li
              key={link.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex min-w-0 flex-1 items-center gap-1">
                <LinkIcon
                  size={16}
                  className="shrink-0 text-blue-500"
                />
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body2-normal truncate text-blue-500 underline"
                >
                  {link.name}
                </a>
              </div>
              {canManage && (
                <DropdownMenu>
                  <DropdownMenu.Trigger asChild>
                    <button
                      type="button"
                      className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#0088FF] hover:bg-[#CCE8FF]"
                      aria-label="더보기"
                    >
                      <EllipsisVertical size={16} />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content align="end">
                    <DropdownMenu.Item
                      onClick={() => {
                        setSelectedLink(link);
                        dispatch({
                          type: 'OPEN',
                          scope: 'studyroom',
                          kind: 'create',
                        });
                      }}
                    >
                      수정하기
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      variant="danger"
                      onClick={() =>
                        dispatch({
                          type: 'OPEN',
                          scope: 'studyroom',
                          kind: 'delete',
                        })
                      }
                    >
                      삭제하기
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
