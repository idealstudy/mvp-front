'use client';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useSessionQuery } from '@/features/auth/services/query';
import { translateModalMessage } from '@/lib/message';

export default function HomePage() {
  const { data } = useSessionQuery();

  if (!data) return;

  return (
    <main className="mx-auto max-w-[570px] px-4 pb-[180px]">
      <Dialog>
        <Dialog.Trigger asChild>
          <Button>다이얼로그 열기</Button>
        </Dialog.Trigger>
        <Dialog.Content className="w-[480px] rounded-2xl p-0">
          <Dialog.Header className="flex items-center justify-center pt-[73px]">
            <Dialog.Title className="text-[24px] leading-[160%] font-bold tracking-[-4%]">
              {translateModalMessage(data.auth).title}
            </Dialog.Title>
          </Dialog.Header>
          <Dialog.Body className="mx-auto mt-4 max-w-[298px] pb-[52px] text-center leading-[160%] tracking-[-4%]">
            {translateModalMessage(data.auth).content}
          </Dialog.Body>
          <Dialog.Footer className="flex h-[85px] items-center gap-0">
            <Dialog.Close
              className="h-full flex-1"
              asChild
            >
              <Button className="bg-[#333333] text-white hover:bg-[#333333]/80">
                나중에
              </Button>
            </Dialog.Close>
            <Dialog.Close
              className="h-full flex-1"
              asChild
            >
              <Button>연결하기</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </main>
  );
}
