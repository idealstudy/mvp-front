'use client';

import { useState } from 'react';

import { Button, Dialog } from '@/shared/components/ui';

const IOS_STEPS = [
  <>
    하단 공유 버튼 <strong>⎋</strong> 탭
  </>,
  <>
    <strong>홈 화면에 추가</strong> 선택
  </>,
  <>
    오른쪽 상단 <strong>추가</strong> 탭
  </>,
];

const MAC_STEPS = [
  <>
    상단 메뉴바 <strong>파일</strong> 클릭
  </>,
  <>
    <strong>Dock에 추가</strong> 선택
  </>,
  <>
    <strong>추가</strong> 클릭
  </>,
];

interface Props {
  isDesktop: boolean;
}

export function IosInstallGuide({ isDesktop }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    sessionStorage.setItem('ios-install-dismissed', 'true');
    setIsOpen(false);
  };

  const handleNeverShow = () => {
    localStorage.setItem('ios-install-dismissed', 'true');
    setIsOpen(false);
  };

  const steps = isDesktop ? MAC_STEPS : IOS_STEPS;

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <Dialog.Content className="max-w-[400px]">
        <Dialog.Header>
          <Dialog.Title>
            {isDesktop ? 'Dock에 추가하기' : '홈 화면에 추가하기'}
          </Dialog.Title>
          <Dialog.Description>
            앱처럼 빠르게 이용할 수 있어요
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="mt-6 gap-4">
          {/* 스크린샷으로 교체 가능 */}
          <div className="flex flex-col gap-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-3"
              >
                <span className="font-body2-heading">{index + 1}.</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </Dialog.Body>
        <Dialog.Footer className="mt-6">
          <Dialog.Close asChild>
            <Button
              className="w-full"
              variant="secondary"
              onClick={handleNeverShow}
            >
              다시 보지 않기
            </Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button
              className="w-full"
              onClick={handleClose}
            >
              확인
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
