import type { ComponentPropsWithoutRef } from 'react';

import Image from 'next/image';

type StudyroomImageButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'onClick'
> & {
  alt: string;
  onClick: () => void;
};

export const StudyroomImageButton = ({
  alt,
  onClick,
  ...buttonProps
}: StudyroomImageButtonProps) => (
  <button
    type="button"
    className="tablet:w-[300px] tablet:h-[300px] h-[200px] w-[200px] shrink-0 cursor-pointer"
    onClick={onClick}
    {...buttonProps}
  >
    <Image
      src="/studyroom/study-room-opened.png"
      priority
      fetchPriority="high"
      alt={alt}
      width={300}
      height={300}
      sizes="(max-width: 767px) 200px, 300px"
      className="h-full w-full object-cover"
    />
  </button>
);
