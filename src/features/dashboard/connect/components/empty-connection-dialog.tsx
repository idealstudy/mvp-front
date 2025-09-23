'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useSession } from '@/features/auth/hooks/use-session';
import { translateModalMessage } from '@/lib/message';

import { useConnectionList } from '../services/query';

const DialogTwStyles = {
  content: 'w-[480px] rounded-2xl p-0',
  header: 'flex items-center justify-center pt-[73px]',
  title: 'text-[24px] leading-[160%] font-bold tracking-[-4%]',
  body: 'mx-auto mt-4 max-w-[298px] pb-[52px] text-center leading-[160%] tracking-[-4%]',
  footer: 'flex h-[85px] items-center gap-0',
  closeButton: 'h-full flex-1',
  cancelButton:
    'bg-gray-scale-gray-90 text-white hover:bg-gray-scale-gray-90/80',
};

export const EmptyConnectionDialog = () => {
  const session = useSession();
  const { data } = useConnectionList({
    state: 'PENDING',
  });

  const hasConnections =
    Array.isArray(data?.connectionList) && data.connectionList.length > 0;

  const userRole = session.data?.auth;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (hasConnections && userRole) {
      setIsOpen(true);
    }
  }, [userRole, hasConnections]);

  if (!userRole || !hasConnections) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <Dialog.Content className={DialogTwStyles.content}>
        <Dialog.Header className={DialogTwStyles.header}>
          <Dialog.Title className={DialogTwStyles.title}>
            {translateModalMessage(userRole).title}
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className={DialogTwStyles.body}>
          {translateModalMessage(userRole).content}
        </Dialog.Body>
        <Dialog.Footer className={DialogTwStyles.footer}>
          <Dialog.Close
            className={DialogTwStyles.closeButton}
            asChild
          >
            <Button
              size="large"
              className={DialogTwStyles.cancelButton}
            >
              나중에
            </Button>
          </Dialog.Close>
          <Dialog.Close
            className={DialogTwStyles.closeButton}
            asChild
          >
            <Button>연결하기</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
