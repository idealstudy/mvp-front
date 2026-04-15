'use client';

import { useEffect, useRef, useTransition } from 'react';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { DashboardSidebar } from '@/features/dashboard/components/dashboard-sidebar';
import BackLink from '@/features/dashboard/studynote/components/back-link';
import {
  StudyRoomsListSkeleton,
  TeachersListSkeleton,
} from '@/features/list/components/card-skeleton';
import { SortKey } from '@/features/qna/types';
import { useSession } from '@/providers';
import { Select } from '@/shared/components/ui';
import { cn } from '@/shared/lib';
import { trackDedu101ListScrollDepth } from '@/shared/lib/analytics';
import { useMemberStore } from '@/store';

export default function ListLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const role = useMemberStore((s) => s.member?.role ?? null);
  const [isPending, startTransition] = useTransition();
  const trackedDepthsRef = useRef<Set<25 | 50 | 75 | 100>>(new Set());

  const isAuthenticated = status === 'authenticated';
  const sortBy = searchParams.get('sort') ?? 'LATEST';
  const subjectBy = searchParams.get('subject') ?? 'ALL';

  const isTeachers = pathname === '/list/teachers';
  const isStudyRooms = pathname === '/list/study-rooms';

  const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
    { value: 'LATEST', label: '최신순' },
    { value: 'OLDEST', label: '오래된순' },
    { value: 'ALPHABETICAL', label: '가나다순' },
  ];

  {
    /* TODO : 추후 업데이트 이후 적용 예정 */
  }
  // const SORT_SUBJECT_OPTIONS = [
  //   { value: 'ALL', label: '전체 과목' },
  //   { value: 'KOREAN', label: '국어' },
  //   { value: 'ENGLISH', label: '영어' },
  //   { value: 'MATH', label: '수학' },
  //   { value: 'OTHER', label: '기타' },
  // ];

  const SELECT_STYLES = {
    trigger:
      'border-line-line2 h-[36px] rounded-[8px] pr-8 pl-2 text-sm w-auto min-w-[110px] text-[var(--color-text-sub2)] whitespace-nowrap mock-[state=open]:border-line-line3 focus:ring-0 focus:outline-none px-3 font-label-normal',
    option:
      'flex h-[32px] border-b-0 text-center w-full font-body2-normal justify-center items-center',
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.set('page', '1');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  useEffect(() => {
    // 목록 페이지(선생님/스터디룸) 진입 시 depth 전송 상태 초기화
    trackedDepthsRef.current.clear();

    const thresholds: Array<25 | 50 | 75 | 100> = [25, 50, 75, 100];

    const handleScrollDepth = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;

      // 스크롤 가능한 높이가 없으면 100%로 간주
      const depth =
        maxScroll <= 0
          ? 100
          : Math.min(100, Math.round((window.scrollY / maxScroll) * 100));

      thresholds.forEach((threshold) => {
        if (depth >= threshold && !trackedDepthsRef.current.has(threshold)) {
          trackedDepthsRef.current.add(threshold);
          trackDedu101ListScrollDepth(
            {
              page: 'dedu101_list',
              depth_percent: threshold,
            },
            role
          );
        }
      });
    };

    handleScrollDepth();
    window.addEventListener('scroll', handleScrollDepth, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollDepth);
    };
  }, [pathname, role]);

  return (
    <div className="flex min-h-screen w-full">
      {/* 사이드바 영역: 로그인 시에만 노출 */}
      {isAuthenticated && <DashboardSidebar />}

      <main
        className={cn(
          'flex-1 transition-all duration-300',
          isAuthenticated ? 'desktop:ml-[250px]' : 'pl-0'
        )}
      >
        <div className="mb-4 min-h-screen w-full bg-white">
          <div className="bg-system-background w-full">
            <div className="mx-auto max-w-[1440px] px-4 pt-8 md:px-8 lg:px-20">
              <BackLink />

              <div className="mt-4 mb-10">
                <h1 className="font-title-heading text-2xl leading-[135%] tracking-tight lg:text-3xl">
                  디에듀와 함께하는 선생님과 스터디룸을 만나보세요
                </h1>
              </div>

              {/* 탭 메뉴 */}
              <div className="relative flex gap-6 lg:gap-10">
                <Link
                  href={`/list/teachers?sort=${sortBy}&subject=${subjectBy}`}
                  replace
                >
                  <div
                    className={cn(
                      'relative cursor-pointer px-4 pb-4 text-lg leading-[135%] transition-all lg:text-[24px]',
                      isTeachers
                        ? 'font-[700] text-[#1A1A1A]'
                        : 'font-[400] text-[#AAAAAA]'
                    )}
                  >
                    선생님 프로필
                    {isTeachers && (
                      <div className="absolute bottom-0 left-0 h-[4px] w-full bg-[#FF5C35]" />
                    )}
                  </div>
                </Link>
                <Link
                  href={`/list/study-rooms?sort=${sortBy}&subject=${subjectBy}`}
                  replace
                >
                  <div
                    className={cn(
                      'relative cursor-pointer px-4 pb-4 text-lg leading-[135%] transition-all lg:text-[24px]',
                      isStudyRooms
                        ? 'font-[700] text-[#1A1A1A]'
                        : 'font-[400] text-[#AAAAAA]'
                    )}
                  >
                    스터디룸
                    {isStudyRooms && (
                      <div className="absolute bottom-0 left-0 h-[4px] w-full bg-[#FF5C35]" />
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* 하단 리스트 및 필터 영역 */}
          <div className="w-full bg-white">
            <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 lg:px-20">
              {/* 정렬 필터 */}
              <div className="mb-6 flex gap-2">
                <Select
                  value={sortBy}
                  onValueChange={(v) => updateFilter('sort', v)}
                >
                  <Select.Trigger
                    className={SELECT_STYLES.trigger}
                    placeholder="최신순"
                  />
                  <Select.Content>
                    {SORT_OPTIONS.map((o) => (
                      <Select.Option
                        key={o.value}
                        value={o.value}
                        className={SELECT_STYLES.option}
                      >
                        {o.label}
                      </Select.Option>
                    ))}
                  </Select.Content>
                </Select>
                {/* TODO : 추후 업데이트 이후 적용 예정 */}
                {/* <Select
                  value={subjectBy}
                  onValueChange={(v) => updateFilter('subject', v)}
                >
                  <Select.Trigger
                    className={SELECT_STYLES.trigger}
                    placeholder="전체 과목"
                  />
                  <Select.Content>
                    {SORT_SUBJECT_OPTIONS.map((o) => (
                      <Select.Option
                        key={o.value}
                        value={o.value}
                        className={SELECT_STYLES.option}
                      >
                        {o.label}
                      </Select.Option>
                    ))}
                  </Select.Content>
                </Select> */}
              </div>
              <div className="relative">
                <div className={isPending ? 'opacity-0' : 'opacity-100'}>
                  {children}
                </div>
                {isPending && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]">
                    {isTeachers ? <TeachersListSkeleton /> : null}
                    {isStudyRooms ? <StudyRoomsListSkeleton /> : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
