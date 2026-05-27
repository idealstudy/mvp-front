'use client';

import { useState } from 'react';

import { cn } from '@/shared/lib';

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
        <select
          value={sort}
          onChange={(event) =>
            setSort(event.target.value as 'recommend' | 'latest')
          }
          className="border-line-line2 cursor-pointer rounded-lg border bg-white px-3 py-1.5 text-sm outline-none"
        >
          <option value="recommend">추천순</option>
          <option value="latest">최신순</option>
        </select>
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
              <div className="flex items-start gap-3">
                <div className="bg-gray-1 text-gray-7 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                  👤
                </div>
                <div>
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
                <button className="text-gray-6 hover:text-orange-7 transition-colors">
                  👍
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
          onClick={() => setExpanded((v) => !v)}
          className="border-line-line1 text-text-main hover:bg-gray-1 w-full rounded-xl border bg-white py-4 text-sm font-semibold"
        >
          {expanded ? '접기' : `더 많은 풀이 보기`}
        </button>
      )}
    </div>
  );
};
