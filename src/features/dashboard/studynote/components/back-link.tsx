'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

const BackLink = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  return (
    <button
      className={cn(
        'text-text-sub2 flex items-center gap-[6px] text-xl leading-[160%] tracking-[-4%]',
        className
      )}
      onClick={() => router.back()}
    >
      {children ? (
        children
      ) : (
        <>
          <Image
            src="/common/arrow-left.svg"
            alt="back-link"
            width={20}
            height={20}
          />
          <p>이전으로</p>
        </>
      )}
    </button>
  );
};

export default BackLink;
