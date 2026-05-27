'use client';

import { useState } from 'react';

import { Select } from '@/shared/components/ui';
import { cn } from '@/shared/lib';
import { ThumbsUp, User } from 'lucide-react';

export type SolutionItem = {
  id: string;
  nickname: string;
  subject: string;
  content: string;
  recommendCount: number;
  isBest: boolean;
};

type SolutionListProps = {
  solutions: SolutionItem[];
  totalCount: number;
};

export const SolutionList = ({ solutions, totalCount }: SolutionListProps) => {
  const [sort, setSort] = useState<'recommend' | 'latest'>('recommend');
  const [expanded, setExpanded] = useState(false);

  const visibleSolutions = expanded ? solutions : solutions.slice(0, 3);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-body1-heading text-text-main">
          다른 사람 풀이 {totalCount}개
        </h2>
        <Select
          value={sort}
          onValueChange={(value) => setSort(value as 'recommend' | 'latest')}
        >
          <Select.Trigger
            className="border-line-line2 font-label-normal h-[36px] w-auto min-w-[90px] rounded-[8px] px-3 pr-8 text-sm whitespace-nowrap focus:ring-0 focus:outline-none"
            placeholder="추천순"
          />
          <Select.Content>
            <Select.Option
              value="recommend"
              className="font-body2-normal flex h-[32px] w-full items-center justify-center border-b-0 text-center"
            >
              추천순
            </Select.Option>
            <Select.Option
              value="latest"
              className="font-body2-normal flex h-[32px] w-full items-center justify-center border-b-0 text-center"
            >
              최신순
            </Select.Option>
          </Select.Content>
        </Select>
      </div>

      <div className="flex flex-col gap-3">
        {visibleSolutions.map((solution) => (
          <div
            key={solution.id}
            className={cn(
              'rounded-xl border bg-white p-5',
              solution.isBest ? 'border-orange-7' : 'border-line-line1'
            )}
          >
            {solution.isBest && (
              <span className="bg-orange-7 mb-3 inline-block rounded-md px-2 py-0.5 text-xs font-semibold text-white">
                베스트 풀이
              </span>
            )}
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="bg-gray-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                  <User
                    size={16}
                    className="text-gray-7"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-body2-heading text-text-main text-sm">
                    {solution.nickname}
                  </p>
                  <p className="text-gray-8 text-xs">{solution.subject}</p>
                  <p className="text-text-main mt-3 text-sm leading-relaxed whitespace-pre-line">
                    {solution.content}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-1">
                <button className="text-gray-6 hover:text-orange-7 cursor-pointer transition-colors">
                  <ThumbsUp size={16} />
                </button>
                <span className="font-body2-heading text-text-main text-sm">
                  {solution.recommendCount}
                </span>
                <span className="text-gray-6 text-xs">추천</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {solutions.length > 3 && (
        <button
          onClick={() => setExpanded((previousExpanded) => !previousExpanded)}
          className="border-line-line1 text-text-main hover:bg-gray-1 w-full cursor-pointer rounded-xl border bg-white py-4 text-sm font-semibold"
        >
          {expanded ? '접기' : '더 많은 풀이 보기'}
        </button>
      )}
    </div>
  );
};
