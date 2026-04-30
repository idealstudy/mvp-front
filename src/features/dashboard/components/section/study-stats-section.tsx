'use client';

import { useState } from 'react';

import { Icon } from '@/shared/components/ui/icon';

const STUDY_STATS = [
  {
    name: '수업노트',
    icon: Icon.Notebook,
    count: '999장',
  },
  {
    name: '학생',
    icon: Icon.Person,
    count: '999명',
  },
  {
    name: '질문',
    icon: Icon.Question,
    count: '999개',
  },
] as const;

export const StudyStatsSection = () => {
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  return (
    <ul className="flex items-center justify-between px-3 py-4">
      {STUDY_STATS.map((stat) => (
        <li
          key={stat.name}
          className="flex cursor-pointer flex-col items-center gap-1"
          onClick={() => setSelectedStat(stat.name)}
        >
          <stat.icon
            className={`mb-1 ${
              selectedStat === stat.name
                ? 'text-key-color-primary'
                : 'text-gray-scale-gray-60'
            }`}
          />
          <p className="text-gray-scale-gray-60 font-label-normal text-center">
            {stat.name}
          </p>
          <p className="font-headline2-heading text-key-color-primary text-center">
            {stat.count}
          </p>
        </li>
      ))}
    </ul>
  );
};
