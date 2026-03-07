import Image from 'next/image';

type StudyroomImageButtonProps = {
  alt: string;
  onClick: () => void;
};

export const StudyroomImageButton = ({
  alt,
  onClick,
}: StudyroomImageButtonProps) => (
  <button
    type="button"
    className="tablet:w-[300px] tablet:h-[300px] h-[200px] w-[200px] shrink-0 cursor-pointer"
    onClick={onClick}
  >
    <Image
      src="/studyroom/study-room-opened.png"
      alt={alt}
      width={300}
      height={300}
      sizes="(max-width: 767px) 200px, 300px"
      className="h-full w-full object-cover"
    />
  </button>
);
