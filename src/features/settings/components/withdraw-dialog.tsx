'use client';

import { useState } from 'react';

import { useWithdraw } from '@/features/settings/hooks/use-withdraw';
import { Button, Dialog } from '@/shared/components/ui';
import { classifyWithdrawError, handleApiError } from '@/shared/lib/errors';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function WithdrawDialog({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<'step1' | 'step2'>('step1');
  const withdrawMutation = useWithdraw();

  const handleClose = () => {
    setStep('step1');
    onClose();
  };

  const handleWithdraw = () => {
    withdrawMutation.mutate(undefined, {
      onError: (error) => {
        handleApiError(error, classifyWithdrawError, {
          onAuth: () => handleClose(),
          onUnknown: () => handleClose(),
        });
      },
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={withdrawMutation.isPending ? undefined : handleClose}
    >
      <Dialog.Content className="max-w-[600px] text-center">
        {step === 'step1' && (
          <>
            <Dialog.Header>
              <Dialog.Title className="mb-7">
                정말 디에듀를 떠나시나요?
              </Dialog.Title>
              <Dialog.Description>
                <p>디에듀는 선생님의 열정과 학생의 성장 순간이</p>
                <p>기록으로 남아 자산이 되는 경험을 만들고 있습니다.</p>
                <br />
                <p>
                  이용하시면서 조금 아쉬운 부분이 있었다면 진심으로 죄송합니다.
                </p>
                <p>더 나은 학습 경험을 위해 계속 발전해 나가겠습니다.</p>
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Footer className="mt-15 flex justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="flex cursor-pointer items-center gap-1"
              >
                <ArrowLeft size={16} />
                <span>계속 이용하기</span>
              </button>
              <button
                type="button"
                onClick={() => setStep('step2')}
                className="text-key-color-primary flex cursor-pointer items-center gap-1"
              >
                <span>탈퇴 계속하기</span>
                <ArrowRight size={16} />
              </button>
            </Dialog.Footer>
          </>
        )}

        {step === 'step2' && (
          <>
            <Dialog.Header>
              <Dialog.Title className="mb-7">
                그동안 함께해 주셔서 감사합니다
              </Dialog.Title>
              <Dialog.Description>
                <p>디에듀와 함께 만들어온 기록은 여기서 마무리되지만</p>
                <p>
                  언젠가 다시 학생의 성장과 수업의 순간을 기록하고 싶어질 때
                </p>
                <p>디에듀가 그 자리를 지키고 있겠습니다.</p>
                <br />
                <p>
                  지금까지 함께 쌓아온 기록은 이 순간을 끝으로 디에듀가 잘
                  정리하겠습니다.
                </p>
                <br />
                <p className="text-system-warning font-body2-heading">
                  정리된 기록은 이후 다시 확인하실 수 없습니다.
                </p>
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Footer className="mt-8 flex-col">
              <Button
                onClick={handleWithdraw}
                disabled={withdrawMutation.isPending}
                className="self-center"
                size="xsmall"
              >
                최종 탈퇴하기
              </Button>
              <button
                type="button"
                onClick={() => setStep('step1')}
                disabled={withdrawMutation.isPending}
                className="flex cursor-pointer items-center gap-1 self-start"
              >
                <ArrowLeft size={16} />
                <span>이전으로 돌아가기</span>
              </button>
            </Dialog.Footer>
          </>
        )}
      </Dialog.Content>
    </Dialog>
  );
}
