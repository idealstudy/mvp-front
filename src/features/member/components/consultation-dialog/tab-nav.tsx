'use client';

import { cn } from '@/shared/lib';

type Props = {
  activeTab: 'write' | 'list';
  onTabChange: (tab: 'write' | 'list') => void;
};

export const ConsultationTabNav = ({ activeTab, onTabChange }: Props) => {
  return (
    <div className="flex gap-2">
      {(['write', 'list'] as const).map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={cn(
              'font-body2-normal rounded-full border px-5 py-2 transition-colors',
              isActive
                ? 'border-key-color-primary text-key-color-primary'
                : 'border-gray-4 text-gray-7 hover:border-gray-6'
            )}
          >
            {tab === 'write' ? '기록 일지 작성' : '기록 일지 기록'}
          </button>
        );
      })}
    </div>
  );
};
