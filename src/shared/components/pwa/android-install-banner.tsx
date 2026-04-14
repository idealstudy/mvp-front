'use client';

import { Button } from '@/shared/components/ui/button';

interface Props {
  triggerInstall: () => Promise<void>;
}

export function AndroidInstallBanner({ triggerInstall }: Props) {
  return (
    <div className="border-gray-3 fixed inset-x-0 bottom-10 z-10 mx-auto flex max-w-150 items-center justify-between rounded-xl border bg-white p-4 shadow-lg">
      <p>앱으로 설치하면 더 편리해요</p>
      <Button
        size="xsmall"
        variant="secondary"
        onClick={triggerInstall}
      >
        설치하기
      </Button>
    </div>
  );
}
