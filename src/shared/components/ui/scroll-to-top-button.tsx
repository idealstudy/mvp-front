'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib';
import { ArrowUp } from 'lucide-react';

const SHOW_OFFSET = 240;

// 위로 이동 버튼
export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const updateVisible = () => {
      const next = window.scrollY > SHOW_OFFSET;
      // 이전 값과 다를 때만 실제 상태 변경
      setIsVisible((prev) => (prev === next ? prev : next));
    };

    const handleScroll = () => {
      // 이미 예약된 프레임 있으면 스킵 (rAF throttle)
      if (rafIdRef.current !== null) return;

      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        updateVisible();
      });
    };

    updateVisible();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="맨 위로 이동"
      className={cn(
        'fixed right-4 bottom-10 z-50 cursor-pointer',
        'tablet:right-8',
        'bg-key-color-primary hover:bg-key-color-secondary',
        'rounded-full p-2.5 text-white shadow-md',
        'desktop:p-3',
        'transition-all duration-200',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0'
      )}
    >
      <ArrowUp className="tablet:h-6 tablet:w-6 h-5 w-5" />
    </button>
  );
};
