import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/shared/lib';
import { Flame, User } from 'lucide-react';

export type ChallengeSubject = 'MATH' | 'KOREAN' | 'ENGLISH' | 'SCIENCE';

export type ChallengeCardData = {
  id: string;
  subject: ChallengeSubject;
  title: string;
  sourceText: string;
  questionImageUrl: string | null;
  passRate: number;
  participantCount: number;
};

type SubjectConfig = {
  label: string;
  tagClass: string;
  bgClass: string;
  borderClass: string;
};

const SUBJECT_CONFIG: Record<ChallengeSubject, SubjectConfig> = {
  MATH: {
    label: '수학',
    tagClass: 'bg-orange-7 text-white',
    bgClass: 'bg-orange-1',
    borderClass: 'border-orange-3',
  },
  KOREAN: {
    label: '국어',
    tagClass: 'bg-blue-500 text-white',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-100',
  },
  ENGLISH: {
    label: '영어',
    tagClass: 'bg-green-600 text-white',
    bgClass: 'bg-green-50',
    borderClass: 'border-green-100',
  },
  SCIENCE: {
    label: '탐구',
    tagClass: 'bg-purple-500 text-white',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-100',
  },
};

const PASS_RATE_DENOMINATOR = 10;

export const ChallengeCard = ({
  challenge,
}: {
  challenge: ChallengeCardData;
}) => {
  const config = SUBJECT_CONFIG[challenge.subject];
  const correctCountOutOf10 = Math.round(
    (challenge.passRate / 100) * PASS_RATE_DENOMINATOR
  );

  return (
    <Link
      href={`/open-challenge/${challenge.id}`}
      className={cn(
        'group focus-visible:ring-key-color-primary flex min-h-full overflow-hidden rounded-xl border transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none',
        config.borderClass
      )}
      aria-label={`${challenge.title} 도전하기`}
    >
      <div
        className={cn(
          'relative flex min-h-[200px] items-center justify-center p-6',
          config.bgClass
        )}
      >
        <span
          className={cn(
            'absolute top-3 left-3 rounded-md px-2 py-0.5 text-xs font-semibold',
            config.tagClass
          )}
        >
          {config.label}
        </span>
        {challenge.questionImageUrl ? (
          <Image
            src={challenge.questionImageUrl}
            alt={challenge.title}
            width={280}
            height={160}
            className="max-h-[160px] object-contain"
          />
        ) : (
          <div className="flex h-[160px] w-full items-center justify-center">
            <p className="text-gray-8 text-center text-sm italic">
              미리보기 없음
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 bg-white p-5">
        <div>
          <p className="text-orange-7 flex items-center gap-1 text-sm font-semibold">
            <Flame size={14} />
            통과율 {challenge.passRate}% — 10명 중 {correctCountOutOf10}명만
            맞혔어요
          </p>
          <h3 className="text-text-main mt-1 text-base font-bold">
            {challenge.title}
          </h3>
          <p className="text-gray-8 mt-0.5 text-sm">{challenge.sourceText}</p>
        </div>

        <div className="border-line-line1 mt-auto flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-text-main font-semibold">
              통과율 {challenge.passRate}%
            </span>
            <span className="text-gray-4">|</span>
            <span className="text-gray-8 flex items-center gap-1">
              <User size={13} />
              {challenge.participantCount.toLocaleString()}명 도전 중
            </span>
          </div>
          <span className="text-orange-7 group-hover:text-orange-8 text-sm font-semibold transition-colors">
            도전하기
          </span>
        </div>
      </div>
    </Link>
  );
};
