import { useState } from 'react';

import Image from 'next/image';

import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/lib';

import { ConnectDialog } from '../section-content/parent-connect-dialog';

export const ParentLinkSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className={cn('bg-orange-scale-orange-1 rounded-lg p-4')}>
      <section>
        <div className="flex w-full items-center justify-between gap-2 text-left">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/dashboard/parent-onboarding-link.png"
              alt="연결"
              height={36}
              width={36}
              unoptimized
            />
            <div className="flex flex-col">
              <p className="font-body2-heading text-gray-12">
                학생을 연결해볼까요?
              </p>
              <p className="font-label-normal text-gray-11">
                자녀의 학습 현황과 선생님 피드백을 실시간으로 확인할 수 있어요
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
            }}
            className="font-label-heading h-[35px] w-[121px]"
          >
            학생 연결하기
          </Button>
        </div>
      </section>
      {isDialogOpen && (
        <ConnectDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  );
};
