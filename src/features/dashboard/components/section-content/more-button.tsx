import Link from 'next/link';

interface MoreButtonProps {
  href: string;
}

const MoreButton = ({ href }: MoreButtonProps) => {
  return (
    <Link
      href={href}
      className="bg-gray-white text-gray-12 border-gray-5 tablet:py-5 desktop:py-4 hover:bg-gray-1 flex w-full items-center justify-center rounded-lg border-1 px-8 py-3"
    >
      <span className="font-body2-normal tablet:font-headline2-normal text-gray-12">
        더보기
      </span>
    </Link>
  );
};

export default MoreButton;
