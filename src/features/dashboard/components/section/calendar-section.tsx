'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { StudentNoteMonthlyDailyItemDTO } from '@/entities/student-study-note';
import {
  useStudentNoteDelete,
  useStudentNoteDetail,
  useStudentNoteUpdate,
  useStudyNoteMonthly,
} from '@/features/student-study-note/hooks';
import {
  TextEditor,
  TextViewer,
  mergeResolvedContentWithMediaIds,
  parseEditorContent,
  prepareContentForSave,
} from '@/shared/components/editor';
import { Button } from '@/shared/components/ui/button';
import { Dialog } from '@/shared/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { PRIVATE } from '@/shared/constants';
import { cn } from '@/shared/lib';
import { useMemberStore } from '@/store';
import { JSONContent } from '@tiptap/react';
import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';

import { TimerModal } from '../timer';
import {
  SUBJECT_TO_KOREAN,
  formatHHMMSS,
  formatMinSec,
  formatStudyTime,
} from '../timer/constants';

const getBadgeStyle = (
  seconds: number
): { className: string; label: string } => {
  if (seconds === 0)
    return { className: 'bg-gray-2 text-gray-7', label: '학습일지' };
  if (seconds >= 25200)
    return {
      className: 'bg-orange-7 text-white',
      label: formatMinSec(seconds),
    };
  if (seconds >= 10800)
    return {
      className: 'bg-orange-6 text-white',
      label: formatMinSec(seconds),
    };
  if (seconds >= 3600)
    return {
      className: 'bg-orange-5 text-white',
      label: formatMinSec(seconds),
    };
  return {
    className: 'bg-orange-4 text-orange-12',
    label: formatMinSec(seconds),
  };
};

/* ------------------------------------------------------------------ */
/* MonthCalendar                                                        */
/* ------------------------------------------------------------------ */

const WEEK_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const MonthCalendar = ({
  year,
  month,
  dailySummaryList = [],
  onNavigate,
  minYear,
  todayYear,
  todayMonth,
}: {
  year: number;
  month: number;
  dailySummaryList: StudentNoteMonthlyDailyItemDTO[];
  onNavigate: (year: number, month: number) => void;
  minYear: number;
  todayYear: number;
  todayMonth: number;
}) => {
  const router = useRouter();
  const [selectedEntry, setSelectedEntry] = useState<{
    id: number;
    studyTime: number;
  } | null>(null);
  const [timerDeleteOpen, setTimerDeleteOpen] = useState(false);
  const [noTimerEditOpen, setNoTimerEditOpen] = useState(false);
  const [noTimerDeleteOpen, setNoTimerDeleteOpen] = useState(false);
  const [editContent, setEditContent] = useState<JSONContent | null>(null);
  const { mutate: deleteNote } = useStudentNoteDelete();
  const { mutate: updateNote, isPending: isUpdating } = useStudentNoteUpdate();
  const { data: selectedNote } = useStudentNoteDetail(selectedEntry?.id ?? 0);

  const selectedNoteId = selectedEntry?.id ?? null;
  const isNoTimerNote = selectedEntry !== null && selectedEntry.studyTime === 0;
  const isTimerNote = selectedEntry !== null && selectedEntry.studyTime > 0;

  const closeAll = () => {
    setSelectedEntry(null);
    setTimerDeleteOpen(false);
    setNoTimerEditOpen(false);
    setNoTimerDeleteOpen(false);
    setEditContent(null);
  };

  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate(); // 전 달
  const firstDayRaw = new Date(year, month - 1, 1).getDay();
  const startOffset = firstDayRaw === 0 ? 6 : firstDayRaw - 1;

  const cells: Array<{ day: number; type: 'prev' | 'current' | 'next' }> = [];
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, type: 'prev' });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: 'current' });
  }
  const tail = cells.length % 7;
  if (tail !== 0) {
    for (let d = 1; d <= 7 - tail; d++) {
      cells.push({ day: d, type: 'next' });
    }
  }

  const handleOtherMonthClick = (type: 'prev' | 'next') => {
    if (type === 'prev') {
      const prevYear = month === 1 ? year - 1 : year;
      const prevMonth = month === 1 ? 12 : month - 1;
      if (prevYear < minYear) return;
      onNavigate(prevYear, prevMonth);
    } else {
      const nextYear = month === 12 ? year + 1 : year;
      const nextMonth = month === 12 ? 1 : month + 1;
      if (
        nextYear > todayYear ||
        (nextYear === todayYear && nextMonth > todayMonth)
      )
        return;
      onNavigate(nextYear, nextMonth);
    }
  };

  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-md">
        <div className="grid grid-cols-7">
          {WEEK_DAYS.map((d) => (
            <div
              key={d}
              className="bg-gray-1 border-gray-2 font-label-heading text-gray-7 border-[0.5px] px-3 py-[10.5px]"
            >
              {d}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div
            key={wi}
            className="grid grid-cols-7"
          >
            {week.map((cell, di) => {
              const isCurrent = cell.type === 'current';
              const notes = isCurrent
                ? dailySummaryList[cell.day - 1]
                : undefined;
              return (
                <div
                  key={di}
                  onClick={() => {
                    if (
                      !isCurrent &&
                      (cell.type === 'prev' || cell.type === 'next')
                    )
                      handleOtherMonthClick(cell.type);
                  }}
                  className={cn(
                    'border-gray-2 flex min-h-[100px] flex-col items-start justify-start gap-1.5 border-[0.5px] p-3 transition-colors',
                    !isCurrent
                      ? 'hover:border-orange-6 hover:bg-orange-1 cursor-pointer'
                      : 'cursor-default'
                  )}
                >
                  <span
                    className={cn(
                      'font-body2-heading',
                      isCurrent ? 'text-text-main' : 'text-gray-2'
                    )}
                  >
                    {cell.day}
                  </span>
                  {(notes?.entries.length ?? 0) > 0 && (
                    <div className="flex flex-col items-start gap-1">
                      {notes!.entries.map((note) => {
                        const badge = getBadgeStyle(note.studyTime);
                        return (
                          <button
                            key={note.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEntry({
                                id: note.id,
                                studyTime: note.studyTime,
                              });
                            }}
                            className={cn(
                              'font-label-normal w-fit cursor-pointer rounded-[6px] px-1.5 py-[3px] hover:opacity-80',
                              badge.className
                            )}
                          >
                            {badge.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 타이머 없는 학습노트 상세 모달 */}
      <Dialog
        isOpen={isNoTimerNote && !noTimerEditOpen && !noTimerDeleteOpen}
        onOpenChange={(open) => {
          if (!open) closeAll();
        }}
      >
        <Dialog.Content className="tablet:max-w-[640px] gap-4">
          <Dialog.Close className="absolute top-6 right-6 cursor-pointer">
            <X size={20} />
          </Dialog.Close>
          <div className="flex flex-col gap-1">
            <Dialog.Title className="font-headline1-heading text-text-main pr-8">
              {selectedNote?.title ?? ''}
            </Dialog.Title>
            <span className="font-body2-normal text-text-sub">
              {selectedNote?.regDate
                ? `${selectedNote.regDate.slice(0, 10).replace(/-/g, '.')} 학습노트`
                : '학습노트'}
            </span>
          </div>
          <div className="border-gray-3 rounded-lg border">
            <TextViewer
              className="max-h-[360px] min-h-[240px] overflow-y-auto px-4 py-4"
              value={parseEditorContent(
                selectedNote?.resolvedContent?.content ||
                  selectedNote?.content ||
                  ''
              )}
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setNoTimerDeleteOpen(true)}
            >
              삭제
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                const rawContent = parseEditorContent(
                  selectedNote?.content || ''
                );
                const parsed = selectedNote?.resolvedContent?.content
                  ? mergeResolvedContentWithMediaIds(
                      rawContent,
                      parseEditorContent(selectedNote.resolvedContent.content)
                    )
                  : rawContent;
                setEditContent(parsed as JSONContent);
                setNoTimerEditOpen(true);
              }}
            >
              수정
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>

      {/* 타이머 없는 학습노트 수정 모달 */}
      <Dialog
        isOpen={isNoTimerNote && noTimerEditOpen}
        onOpenChange={(open) => {
          if (!open) closeAll();
        }}
      >
        <Dialog.Content className="tablet:max-w-[640px] gap-4">
          <Dialog.Close className="absolute top-6 right-6 cursor-pointer">
            <X size={20} />
          </Dialog.Close>
          <div className="flex flex-col gap-1">
            <Dialog.Title className="font-headline1-heading text-text-main pr-8">
              {selectedNote?.title ?? ''}
            </Dialog.Title>
            <span className="font-body2-normal text-text-sub">
              {selectedNote?.regDate
                ? `${selectedNote.regDate.slice(0, 10).replace(/-/g, '.')} 학습노트`
                : '학습노트'}
            </span>
          </div>
          <TextEditor
            value={editContent!}
            onChange={(v) => setEditContent(v)}
            minHeight="240px"
            maxHeight="360px"
          />
          <div className="flex justify-end">
            <Button
              className="px-10"
              disabled={isUpdating}
              onClick={() => {
                if (!selectedNoteId || !editContent) return;
                const { contentString, mediaIds } =
                  prepareContentForSave(editContent);
                updateNote(
                  {
                    studyNoteId: selectedNoteId,
                    body: {
                      title: selectedNote?.title ?? '',
                      subject: selectedNote?.subject ?? '',
                      content: contentString,
                      mediaIds,
                      finishTimestamp: new Date().toISOString(),
                    },
                  },
                  { onSuccess: () => setNoTimerEditOpen(false) }
                );
              }}
            >
              수정 완료
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>

      {/* 타이머 없는 학습노트 삭제 확인 모달 */}
      <Dialog
        isOpen={isNoTimerNote && noTimerDeleteOpen}
        onOpenChange={(open) => {
          if (!open) setNoTimerDeleteOpen(false);
        }}
      >
        <Dialog.Content className="tablet:max-w-[400px] gap-6">
          <Dialog.Close className="absolute top-6 right-6 cursor-pointer">
            <X size={20} />
          </Dialog.Close>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-orange-2 flex size-12 items-center justify-center rounded-full">
              <span className="text-orange-9 font-headline1-heading">!</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Dialog.Title className="font-headline2-heading text-text-main">
                학습노트를 삭제하시겠습니까?
              </Dialog.Title>
              <p className="font-body2-normal text-text-sub">
                삭제된 학습노트는 복구할 수 없습니다.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setNoTimerDeleteOpen(false)}
            >
              취소
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                if (!selectedNoteId) return;
                deleteNote(selectedNoteId, {
                  onSuccess: () => closeAll(),
                });
              }}
            >
              확인
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>

      {/* 타이머 있는 학습노트 상세 모달 */}
      <Dialog
        isOpen={isTimerNote && !timerDeleteOpen}
        onOpenChange={(open) => {
          if (!open) closeAll();
        }}
      >
        <Dialog.Content className="tablet:max-w-[400px] gap-6">
          <Dialog.Close className="absolute top-6 right-6 cursor-pointer">
            <X size={20} />
          </Dialog.Close>
          <Dialog.Title className="font-headline1-heading text-center">
            {formatHHMMSS(selectedNote?.studyTime ?? 0)}
          </Dialog.Title>
          <div className="bg-gray-1 flex flex-col gap-2 rounded-lg px-4 py-3">
            <span className="font-body2-heading text-text-main">
              {selectedNote?.title ?? ''}
            </span>
            <div className="bg-line-line2 h-px w-full" />
            <span className="font-body2-normal text-text-sub">
              {selectedNote?.subject
                ? (SUBJECT_TO_KOREAN[selectedNote.subject] ??
                  selectedNote.subject)
                : ''}
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setTimerDeleteOpen(true)}
            >
              학습 내용 삭제하기
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                if (selectedNoteId)
                  router.push(PRIVATE.STUDENT_NOTE.DETAIL(selectedNoteId));
              }}
            >
              학습노트 보기
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>

      {/* 타이머 있는 학습노트 삭제 확인 모달 */}
      <Dialog
        isOpen={timerDeleteOpen}
        onOpenChange={(open) => {
          if (!open) setTimerDeleteOpen(false);
        }}
      >
        <Dialog.Content className="tablet:max-w-[400px] gap-6">
          <Dialog.Close className="absolute top-6 right-6 cursor-pointer">
            <X size={20} />
          </Dialog.Close>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-orange-2 flex size-12 items-center justify-center rounded-full">
              <span className="text-orange-9 font-headline1-heading">!</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Dialog.Title className="font-headline2-heading text-text-main">
                학습 기록을 삭제하시겠습니까?
              </Dialog.Title>
              <p className="font-body2-normal text-text-sub">
                학습 기록을 삭제하면 기록한 시간도 삭제됩니다.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setTimerDeleteOpen(false)}
            >
              취소
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                if (!selectedNoteId) return;
                deleteNote(selectedNoteId, {
                  onSuccess: () => closeAll(),
                });
              }}
            >
              확인
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* CalendarSection                                                      */
/* ------------------------------------------------------------------ */

const CalendarSection = () => {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const minYear = 2025;
  const [selectedYear, setSelectedYear] = useState(todayYear);
  const [selectedMonth, setSelectedMonth] = useState(todayMonth);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'month' | 'year'>('month');
  const [yearRangeStart, setYearRangeStart] = useState(minYear);
  const [timerOpen, setTimerOpen] = useState(false);

  const member = useMemberStore((s) => s.member);
  const studentId = member?.id ?? 0;

  const { data } = useStudyNoteMonthly(studentId, selectedYear, selectedMonth);

  const totalStudyTime = data ? data.totalStudyTime : 0;
  const dailySummaryList = data ? data.dailySummaryList : [];

  const years = Array.from({ length: 9 }, (_, i) => yearRangeStart + i);

  const navButtonClass =
    'rounded p-1 hover:bg-gray-scale-gray-1 disabled:cursor-not-allowed disabled:opacity-30';
  const cellButtonClass = (isSelected: boolean, isDisabled: boolean) =>
    cn(
      'rounded-lg py-2 text-center text-sm',
      isSelected
        ? 'bg-key-color-primary text-white'
        : 'text-text-main hover:bg-gray-scale-gray-1',
      isDisabled && 'cursor-not-allowed opacity-30 hover:bg-transparent'
    );

  return (
    <div className="flex flex-col gap-6">
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setView('month');
        }}
      >
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2">
            <p className="font-headline1-heading text-gray-12">
              {selectedYear}년 {selectedMonth}월
            </p>
            <button type="button">
              <ChevronDown size={24} />
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-60 p-3"
          align="start"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              disabled={
                view === 'month'
                  ? selectedYear <= minYear
                  : yearRangeStart <= minYear
              }
              className={navButtonClass}
              onClick={() =>
                view === 'month'
                  ? setSelectedYear((y) => y - 1)
                  : setYearRangeStart((y) => y - 9)
              }
            >
              <ChevronLeft size={16} />
            </button>
            {view === 'month' ? (
              <button
                type="button"
                className="hover:bg-gray-scale-gray-1 rounded px-2 py-1 text-sm font-semibold"
                onClick={() => setView('year')}
              >
                {selectedYear}년
              </button>
            ) : (
              <span className="text-sm font-semibold">
                {yearRangeStart} - {yearRangeStart + 8}
              </span>
            )}
            <button
              type="button"
              disabled={
                view === 'month'
                  ? selectedYear >= todayYear
                  : yearRangeStart + 9 > todayYear
              }
              className={navButtonClass}
              onClick={() =>
                view === 'month'
                  ? setSelectedYear((y) => y + 1)
                  : setYearRangeStart((y) => y + 9)
              }
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {view === 'month' ? (
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 12 }, (_, i) => `${i + 1}월`).map(
                (m, i) => {
                  const isDisabled =
                    selectedYear > todayYear ||
                    (selectedYear === todayYear && i + 1 > todayMonth);
                  return (
                    <button
                      key={m}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        setSelectedMonth(i + 1);
                        setIsOpen(false);
                      }}
                      className={cellButtonClass(
                        selectedMonth === i + 1,
                        isDisabled
                      )}
                    >
                      {m}
                    </button>
                  );
                }
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {years.map((y) => {
                const isDisabled = y > todayYear || y < minYear;
                return (
                  <button
                    key={y}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      setSelectedYear(y);
                      setView('month');
                    }}
                    className={cellButtonClass(selectedYear === y, isDisabled)}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          )}
        </PopoverContent>
      </Popover>

      <div className="flex flex-col gap-3">
        <div className="bg-orange-1 text-gray-12 flex justify-between rounded-md px-3 py-[9px]">
          <div className="flex items-center gap-1">
            <Image
              src="/dashboard/img_clock.png"
              alt="clock"
              width={36}
              height={36}
              className="mix-blend-multiply"
            />
            {totalStudyTime > 0 ? (
              <p>
                {selectedMonth}월은 총 {formatStudyTime(totalStudyTime)}{' '}
                공부했어요!
              </p>
            ) : (
              <p>{selectedMonth}월의 공부, 지금 시작해보세요!</p>
            )}
          </div>
          <Button
            className="font-label-heading h-auto rounded-sm px-6 py-2"
            onClick={() => setTimerOpen(true)}
          >
            타이머 켜기
          </Button>
        </div>
        <TimerModal
          isOpen={timerOpen}
          onClose={() => setTimerOpen(false)}
        />
        <MonthCalendar
          year={selectedYear}
          month={selectedMonth}
          dailySummaryList={dailySummaryList}
          onNavigate={(y, m) => {
            setSelectedYear(y);
            setSelectedMonth(m);
          }}
          minYear={minYear}
          todayYear={todayYear}
          todayMonth={todayMonth}
        />
      </div>
    </div>
  );
};

export default CalendarSection;
