import { toast } from 'react-toastify';

import { X } from 'lucide-react';

interface BottomToastContentProps {
  message: string;
  closeToast?: () => void;
}

const CloseButton = ({ closeToast }: { closeToast?: () => void }) => {
  return (
    <button
      type="button"
      onClick={closeToast}
      className="shrink-0 text-white hover:opacity-80"
      aria-label="닫기"
    >
      <X
        className="tablet:size-6 h-4 w-4"
        strokeWidth={2}
      />
    </button>
  );
};

const BottomToastContent = ({
  message,
  closeToast,
}: BottomToastContentProps) => {
  return (
    <div className="bg-gray-11 tablet:w-max tablet:gap-2 tablet:px-6 tablet:py-4 flex w-82 items-center justify-between gap-1 rounded-lg px-3 py-3">
      <p className="font-label-normal tablet:font-body1-normal flex-1 leading-relaxed text-white">
        {message}
      </p>
      <CloseButton closeToast={closeToast} />
    </div>
  );
};

export const showBottomToast = (message: string) => {
  toast(
    ({ closeToast }) => (
      <BottomToastContent
        message={message}
        closeToast={closeToast}
      />
    ),
    {
      containerId: 'bottom-center',
      position: 'bottom-center',
      hideProgressBar: true,
      className: '!bg-transparent !shadow-none !p-0 !min-h-0 tablet:!w-auto',
      closeButton: CloseButton,
    }
  );
};
