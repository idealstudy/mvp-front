'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib';
import type { DashboardTab } from '@/shared/lib/analytics';
import {
  trackDashboardStudyroomFilter,
  trackDashboardTabClick,
} from '@/shared/lib/analytics';
import { useMemberStore } from '@/store';
import { ChevronDown } from 'lucide-react';

const TAB_CODE_MAP: Record<string, DashboardTab> = {
  수업노트: 'studynote',
  멤버: 'member',
  과제: 'homework',
};

export type StudyRoom = { id: number; name: string };

// ─── StudyRoomDropdown ────────────────────────────────────────────────────────
// 스터디룸 선택 드롭다운. isOpen 상태만 내부에서 관리하고,
// 선택 값은 부모(selectedId)에서 제어합니다.

type DropdownProps = {
  studyRooms: StudyRoom[];
  selectedId: number | null;
  student?: boolean;
  parent?: boolean;
  onSelect: (id: number | null) => void;
};

export const StudyRoomDropdown = ({
  studyRooms,
  selectedId,
  student,
  parent,
  onSelect,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const label =
    studyRooms.find((r) => r.id === selectedId)?.name ?? '전체 스터디룸';

  return (
    <div
      ref={ref}
      className="tablet:w-48 relative inline-block w-30"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'bg-gray-1 flex items-center gap-2.5 rounded-lg px-4 py-2.5',
          'font-body1-heading tablet:font-headline1-heading text-gray-12',
          'w-full',
          isOpen && 'rounded-b-none'
        )}
      >
        <span className="min-w-0 flex-1 truncate text-left">{label}</span>
        <ChevronDown
          className={cn(
            'text-gray-12 size-6 flex-shrink-0',
            'transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <ul
          className={cn(
            'absolute top-full left-0 z-10 max-h-[300px] w-full overflow-y-auto',
            'bg-gray-1 rounded-b-lg shadow-md',
            'flex flex-col py-1'
          )}
        >
          {!student && !parent && (
            <li>
              <button
                type="button"
                onClick={() => {
                  onSelect(null);
                  setIsOpen(false);
                }}
                className={cn(
                  'font-body1-normal text-gray-12 w-full px-5 py-3 text-left',
                  'hover:bg-gray-2 transition-colors',
                  selectedId === null && 'font-body1-heading text-orange-7'
                )}
              >
                전체 스터디룸
              </button>
            </li>
          )}
          {studyRooms.map((room) => (
            <li key={room.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(room.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'font-body1-normal text-gray-12 w-full px-5 py-3 text-left',
                  'hover:bg-gray-2 transition-colors',
                  selectedId === room.id && 'font-body1-heading text-orange-7'
                )}
              >
                {room.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ─── TabbedSection ────────────────────────────────────────────────────────────
// 스터디룸 드롭다운 + 헤딩 + 탭 바 + 탭 패널을 조합하는 레이아웃 컴포넌트.
// - selectedId / onSelectStudyRoom: 부모(student/teacher section)에서 제어
// - selectedIndex: 탭 전환은 내부에서 관리 (탭 변경이 데이터 페칭에 영향을 주지 않으므로)

type Props = {
  studyRooms: StudyRoom[];
  selectedId: number | null;
  onSelectStudyRoom: (id: number | null) => void;
  tabs: string[];
  content: React.ReactNode[];
  className?: string;
};

const TabbedSection = ({
  studyRooms,
  selectedId,
  onSelectStudyRoom,
  tabs,
  content,
  className,
}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const member = useMemberStore((s) => s.member);

  const handleSelectStudyRoom = (id: number | null) => {
    onSelectStudyRoom(id);
    trackDashboardStudyroomFilter(id, member?.role);
  };

  const handleTabClick = (index: number, tab: string) => {
    setSelectedIndex(index);
    const tabCode = TAB_CODE_MAP[tab] ?? 'studynote';
    trackDashboardTabClick(tabCode, member?.role);
  };

  const selectedStudyRoom = studyRooms.find((r) => r.id === selectedId) ?? null;
  const headingName =
    studyRooms.length === 1
      ? (studyRooms[0]?.name ?? '')
      : (selectedStudyRoom?.name ?? '');

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-6',
        'tablet:w-full tablet:gap-8',
        className
      )}
    >
      <div className="flex items-center">
        {studyRooms.length > 1 && (
          <StudyRoomDropdown
            studyRooms={studyRooms}
            selectedId={selectedId}
            onSelect={handleSelectStudyRoom}
          />
        )}
        <h1 className="font-body1-heading tablet:font-headline1-heading text-gray-12">
          {studyRooms.length < 2 && headingName}의 정보들을 한눈에 확인해봐요
        </h1>
      </div>

      <div
        role="tablist"
        className="flex flex-wrap gap-2"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={selectedIndex === index}
            aria-controls={`tabpanel-${index}`}
            id={`tab-${index}`}
            onClick={() => handleTabClick(index, tab)}
            className={cn(
              'rounded-full border px-6 py-2.5 transition-colors',
              selectedIndex === index
                ? 'border-orange-7 bg-orange-2 text-orange-7 font-label-heading tablet:font-body2-heading'
                : 'border-gray-5 bg-gray-white text-gray-5 font-label-normal tablet:font-body2-normal'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`tabpanel-${selectedIndex}`}
        aria-labelledby={`tab-${selectedIndex}`}
      >
        {content[selectedIndex]}
      </div>
    </div>
  );
};

export default TabbedSection;
