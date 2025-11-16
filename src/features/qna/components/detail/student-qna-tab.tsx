'use client';

import { FormEvent, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

import QuestionListWrapper from './qna-list-wrapper';

type Props = {
  studyRoomId: number;
};

export default function StudentQuestionSession({ studyRoomId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? '';
    if (value) sessionStorage.setItem('qna-title', value);
    try {
      setIsLoading(true);
      router.push(`/study-rooms/${studyRoomId}/qna/new`);
    } finally {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <p className="font-headline1-heading whitespace-pre-wrap">
        {'궁금한 점이 생겼나요? 언제든 질문해보세요!'}
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex h-[56px] flex-row items-center gap-[10px] rounded-[12px] bg-white"
      >
        <Input
          ref={inputRef}
          className="desktop:w-[504px] border-line-line1 h-[56px] px-6 py-[18px]"
          placeholder="선생님이 질문을 기다리고 있어요."
          maxLength={30}
        />
        <Button
          type="submit"
          className="desktop:w-[162px] h-[56px] rounded-[8px] text-white"
          disabled={isLoading}
        >
          <span className="font-body2-normal font-bold">
            {isLoading ? '페이지 이동중...' : '질문하기'}
          </span>
        </Button>
      </form>

      <QuestionListWrapper studyRoomId={studyRoomId} />
    </div>
  );
}
