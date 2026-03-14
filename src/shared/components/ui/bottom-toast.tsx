import { toast } from 'react-toastify';

import { X } from 'lucide-react';

const styles = `
  @keyframes toast-fade-in  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes toast-fade-out { from { opacity: 1; } to { opacity: 0; } }
  .toast-fade-enter { animation: toast-fade-in  0.15s ease forwards; }
  .toast-fade-exit  { animation: toast-fade-out 0.15s ease forwards; }
`;

interface BottomToastContentProps {
  message: string;
  closeToast?: () => void;
}

const BottomToastContent = ({
  message,
  closeToast,
}: BottomToastContentProps) => {
  return (
    <>
      <style>{styles}</style>
      <div className="bg-gray-11 tablet:w-max tablet:gap-2 tablet:px-6 tablet:py-4 flex w-82 items-center justify-between gap-1 rounded-lg px-3 py-3">
        <p className="font-label-normal tablet:font-body1-normal flex-1 leading-relaxed text-white">
          {message}
        </p>
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
      </div>
    </>
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
      autoClose: 10000,
      closeButton: false,
      hideProgressBar: true,
      className: '!bg-transparent !shadow-none !p-0 !min-h-0 tablet:!w-auto',
    }
  );
};
