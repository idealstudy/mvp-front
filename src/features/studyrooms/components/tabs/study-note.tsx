'use client';

import { FormEvent, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTE } from '@/constants/route';

export const StudyNote = () => {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? '';
    if (!value) return;
    localStorage.setItem('studynote-title', value);
    try {
      setIsLoading(true);
      router.push(ROUTE.DASHBOARD.STUDYNOTE.CREATE);
    } finally {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <p className="font-headline1-heading whitespace-pre-wrap">
        {'이번엔 어떤 수업을\n진행하셨나요?'}
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex h-[56px] flex-row items-center gap-[10px] rounded-[12px] bg-white"
      >
        <Input
          ref={inputRef}
          className="desktop:w-[504px] border-line-line1 h-[56px] px-6 py-[18px]"
          placeholder="수업노트 제목을 입력해주세요."
          maxLength={30}
        />
        <Button
          type="submit"
          className="desktop:w-[162px] h-[56px] rounded-[8px] text-white"
          disabled={isLoading}
        >
          <span className="font-body2-normal font-bold">
            {isLoading ? '페이지 이동중...' : '수업노트 작성'}
          </span>
        </Button>
      </form>
    </>
  );
};
