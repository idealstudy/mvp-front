'use client';

import { useState } from 'react';

import { TextViewer, parseEditorContent } from '@/shared/components/editor';
import { Select } from '@/shared/components/ui';
import { cn, extractText } from '@/shared/lib';
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

const CONTENT_EXPAND_THRESHOLD = 150;
const CONTENT_LINE_THRESHOLD = 4;

const countContentLines = (jsonString: string): number => {
  try {
    const doc = JSON.parse(jsonString);
    let count = 0;
    const traverse = (node: { type?: string; content?: unknown[] }) => {
      if (node.type === 'hardBreak') count++;
      if (node.type === 'paragraph') count++;
      node.content?.forEach((child) => traverse(child as typeof node));
    };
    doc.content?.forEach((node: unknown) =>
      traverse(node as { type?: string; content?: unknown[] })
    );
    return count;
  } catch {
    return 0;
  }
};

export const SolutionList = ({ solutions, totalCount }: SolutionListProps) => {
  const [sort, setSort] = useState<'recommend' | 'latest'>('recommend');
  const [expanded, setExpanded] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const visibleSolutions = expanded ? solutions : solutions.slice(0, 3);

  const toggleContentExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
        {visibleSolutions.map((solution) => {
          const parsedContent = parseEditorContent(solution.content);
          const plainText = extractText(solution.content);
          const isLong =
            plainText.length > CONTENT_EXPAND_THRESHOLD ||
            countContentLines(solution.content) > CONTENT_LINE_THRESHOLD;
          const isContentExpanded = expandedIds.has(solution.id);

          return (
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
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="bg-gray-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                    <User
                      size={16}
                      className="text-gray-7"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-body2-heading text-text-main text-sm">
                      {solution.nickname}
                    </p>
                    <p className="text-gray-8 text-xs">{solution.subject}</p>
                    <div
                      className={cn(
                        'mt-3',
                        !isContentExpanded && isLong && 'line-clamp-4'
                      )}
                    >
                      <TextViewer value={parsedContent} />
                    </div>
                    {isLong && (
                      <button
                        type="button"
                        onClick={() => toggleContentExpand(solution.id)}
                        className="text-gray-7 hover:text-text-main mt-2 cursor-pointer text-xs font-semibold"
                      >
                        {isContentExpanded ? '접기' : '더보기'}
                      </button>
                    )}
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
          );
        })}
      </div>

      {solutions.length > 3 && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="border-line-line1 text-text-main hover:bg-gray-1 w-full cursor-pointer rounded-xl border bg-white py-4 text-sm font-semibold"
        >
          {expanded ? '접기' : '더 많은 풀이 보기'}
        </button>
      )}
    </div>
  );
};
