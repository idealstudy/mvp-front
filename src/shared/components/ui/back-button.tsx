'use client';

import { useRouter } from 'next/navigation';

import { cn } from '@/shared/lib';
import { ChevronLeft } from 'lucide-react';

type BackButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  label?: string;
};

export const BackButton = ({
  className,
  label = '이전으로',
  type = 'button',
  ...props
}: BackButtonProps) => {
  const router = useRouter();

  return (
    <button
      type={type}
      onClick={() => router.back()}
      className={cn(
        'text-gray-8 hover:text-text-main flex cursor-pointer items-center gap-1 text-sm font-semibold',
        className
      )}
      {...props}
    >
      <ChevronLeft size={18} />
      <span>{label}</span>
    </button>
  );
};
