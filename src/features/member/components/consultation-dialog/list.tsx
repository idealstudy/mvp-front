'use client';

import { ChevronRight } from 'lucide-react';

import { ConsultationDialogLayout, ConsultationTabNav } from '.';

type ConsultationItem = {
  id: string;
  date: string;
  preview: string;
};

type Props = {
  studentName: string;
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: 'write' | 'list') => void;
  onSelectItem: (id: string) => void;
  items: ConsultationItem[];
};

export const ConsultationList = ({
  studentName,
  isOpen,
  onClose,
  onTabChange,
  onSelectItem,
  items,
}: Props) => {
  return (
    <ConsultationDialogLayout
      isOpen={isOpen}
      onClose={onClose}
      title={`${studentName} 학생 상담서`}
      navigation={
        <ConsultationTabNav
          activeTab="list"
          onTabChange={onTabChange}
        />
      }
    >
      <p className="font-body2-heading text-gray-12 mb-4">
        {items.length}개의 상담서
      </p>

      <ul className="flex flex-col gap-4 pr-1">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex items-stretch gap-3"
          >
            {/* Timeline dot + line */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-4 mt-4 h-3 w-3 shrink-0 rounded-full" />
              {index < items.length - 1 && (
                <div className="bg-gray-3 mt-1 w-px flex-1" />
              )}
            </div>

            {/* Card */}
            <button
              type="button"
              onClick={() => onSelectItem(item.id)}
              className="border-line-line1 hover:bg-gray-1 mb-4 flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="font-caption-normal text-gray-7 mb-1">
                  {item.date}
                </p>
                <p className="font-body2-normal text-gray-10 line-clamp-3">
                  {item.preview}
                </p>
              </div>
              <ChevronRight
                className="text-gray-5 shrink-0"
                size={20}
              />
            </button>
          </li>
        ))}
      </ul>
    </ConsultationDialogLayout>
  );
};
