'use client';

import { FormEvent, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

type Props = {
  studyRoomId: number;
  title: string;
  placeholder: string;
  buttonText: string;
  storageKey: string;
  targetPath: string;
  buttonTestId?: string;
  inputTestId?: string;
};

export const StudyNoteSearch = ({
  studyRoomId,
  title,
  placeholder,
  buttonText,
  storageKey,
  targetPath,
  buttonTestId,
  inputTestId,
}: Props) => {
  const [isLoading, setisLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? '';
    if (value) sessionStorage.setItem(storageKey, value);

    try {
      setisLoading(true);
      router.push(`/study-rooms/${studyRoomId}/${targetPath}`);
    } finally {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };
  return (
    <>
      <p className="font-headline1-heading whitespace-pre-wrap">{title}</p>

      <form
        onSubmit={handleSubmit}
        className="flex h-[56px] items-center gap-[10px] rounded-[12px] bg-white"
      >
        <Input
          ref={inputRef}
          className="desktop:w-[504px] border-line-line1 h-[56px] px-6 py-[18px]"
          placeholder={placeholder}
          maxLength={30}
          data-testid={inputTestId}
        />
        <Button
          type="submit"
          className="desktop:w-[162px] h-[56px] rounded-[8px] text-white"
          disabled={isLoading}
          data-testid={buttonTestId}
        >
          <span className="font-body2-normal font-bold">
            {isLoading ? '페이지 이동중...' : buttonText}
          </span>
        </Button>
      </form>
    </>
  );
};
