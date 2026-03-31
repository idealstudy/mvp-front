'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { NotificationPopover } from '@/features/notifications/components/notification-popover';
import {
  useStudentStudyRoomsQuery,
  useTeacherStudyRoomsQuery,
} from '@/features/study-rooms';
import type {
  StudentStudyRoom,
  StudyRoom,
} from '@/features/study-rooms/model/types';
import {
  FindingIcon,
  HomeIcon,
  PlusIcon,
  TextIcon,
} from '@/shared/components/icons';
import { DropdownMenu } from '@/shared/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverLink,
  PopoverNav,
  PopoverSection,
  PopoverSeparator,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  BUTTON_BASE,
  FEEDBACK_BUTTON_BASE,
  PRIVATE,
  PUBLIC,
  ROLE_META_MAP,
} from '@/shared/constants';
import { cn } from '@/shared/lib';
import {
  trackGnbLogoClick,
  trackGnbLogoutClick,
  trackGnbMenuClick,
  trackGnbProfileClick,
} from '@/shared/lib/gtm/trackers';
import { useMemberStore } from '@/store';

export const Header = () => {
  const session = useMemberStore((s) => s.member);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // 역할에 따라 조건부로 API 호출
  const { data: teacherStudyRoomList } = useTeacherStudyRoomsQuery({
    enabled: session?.role === 'ROLE_TEACHER',
  });

  const { data: studentStudyRoomList } = useStudentStudyRoomsQuery({
    enabled: session?.role === 'ROLE_STUDENT',
  });

  // 역할에 따라 적절한 리스트 선택
  const studyRoomList: StudyRoom[] | StudentStudyRoom[] | undefined =
    session?.role === 'ROLE_TEACHER'
      ? teacherStudyRoomList
      : session?.role === 'ROLE_STUDENT'
        ? studentStudyRoomList
        : undefined;

  const goToMypage = () => {
    router.push('/mypage');
  };

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    trackGnbLogoutClick(session?.role ?? null);
  };

  return (
    <header className="h-header-height fixed top-0 right-0 left-0 z-50 flex items-center border-b border-gray-200 bg-[#1A1A1A] px-8">
      <div className="mx-auto flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={PUBLIC.CORE.INDEX}
            onClick={() => {
              // GNB 로고 클릭 이벤트 전송
              trackGnbLogoClick(session?.role ?? null);
            }}
          >
            <Image
              src={'/logo.svg'}
              alt="THE EDU 로고"
              width={79}
              height={22}
              className="cursor-pointer"
            />
          </Link>
          <Image
            src={'/img_header_beta.svg'}
            alt="BETA"
            width={44}
            height={20}
          />
          <Link
            href="https://forms.gle/ktLvekAsKTkqTcpQ6"
            className={cn(FEEDBACK_BUTTON_BASE, 'ml-2', 'max-desktop:hidden')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/ic_question_mark.svg"
              alt="피드백"
              width={16}
              height={16}
            />
            소중한 의견 보내기
          </Link>
          <Link
            href="/list/teachers?sort=LATEST&subject=ALL"
            className="hover:text-orange-scale-orange-50 max-desktop:hidden ml-4 border-r border-white pr-2 text-sm font-medium text-white transition-colors"
          >
            디에듀 101 목록
          </Link>
          <Link
            href={PUBLIC.COMMUNITY.COLUMN.LIST}
            className="hover:text-orange-scale-orange-50 max-desktop:hidden text-sm font-medium text-white transition-colors"
          >
            게시판
          </Link>
        </div>
        {session && (
          <div className="desktop:gap-4 flex items-center gap-1">
            <NotificationPopover />

            <DropdownMenu>
              <DropdownMenu.Trigger
                className="flex cursor-pointer items-center justify-center"
                onClick={() => {
                  // GNB 프로필 조회 클릭 이벤트 전송
                  trackGnbProfileClick(session?.role ?? null);
                }}
              >
                <Image
                  src={'/img_header_profile.svg'}
                  alt="프로필 사진"
                  width={48}
                  height={48}
                  className="desktop:flex hidden cursor-pointer rounded-full"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => goToMypage()}>
                  마이페이지
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleLogout()}>
                  로그아웃
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>

            {session?.role && (
              <div className="desktop:flex hidden items-center rounded-[40px] border px-2 py-[2px] text-[12px] font-[400px] text-[#ffffff]">
                {ROLE_META_MAP[session.role]?.label}
              </div>
            )}

            <Popover
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="햄버거 메뉴"
                  className="desktop:hidden flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-800"
                  onClick={() => {
                    trackGnbMenuClick(session?.role ?? null);
                  }}
                >
                  <Image
                    src={'/ic_hamburger.svg'}
                    alt="햄버거 메뉴 아이콘"
                    width={24}
                    height={24}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-[320px]"
              >
                <PopoverNav>
                  {/* 홈 링크 */}
                  <PopoverLink
                    href={PRIVATE.DASHBOARD.INDEX}
                    onClick={() => setIsOpen(false)}
                  >
                    <HomeIcon />
                    <span>대시보드</span>
                  </PopoverLink>

                  {/* 강사 프로필 링크 */}
                  <PopoverLink
                    href={PUBLIC.CORE.LIST.TEACHERS}
                    onClick={() => setIsOpen(false)}
                  >
                    <span>강사 프로필</span>
                  </PopoverLink>

                  {/* 게시판 */}
                  <PopoverLink
                    href={PUBLIC.COMMUNITY.COLUMN.LIST}
                    onClick={() => setIsOpen(false)}
                  >
                    <span>게시판</span>
                  </PopoverLink>

                  {/* 스터디룸 섹션 */}
                  <div className="mt-2 flex flex-col gap-1">
                    <PopoverSection
                      action={
                        session?.role === 'ROLE_TEACHER' ? (
                          <Link
                            href={PRIVATE.ROOM.CREATE}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 transition-colors hover:bg-gray-200"
                            onClick={() => setIsOpen(false)}
                            aria-label="스터디룸 생성"
                          >
                            <PlusIcon />
                          </Link>
                        ) : null
                      }
                    >
                      <TextIcon />
                      <span>스터디룸</span>
                    </PopoverSection>

                    {/* 스터디룸 리스트 */}
                    {studyRoomList && studyRoomList.length > 0 ? (
                      <div className="flex max-h-50 flex-col gap-1 overflow-auto">
                        {studyRoomList.map((item) => (
                          <PopoverLink
                            key={item.id}
                            href={PRIVATE.ROOM.DETAIL(item.id)}
                            onClick={() => setIsOpen(false)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            {item.name}
                          </PopoverLink>
                        ))}
                      </div>
                    ) : (
                      <p className="px-3 py-2 text-sm text-gray-400">
                        스터디룸이 없습니다
                      </p>
                    )}
                  </div>
                  <PopoverLink
                    href={PUBLIC.CORE.LIST.TEACHERS}
                    onClick={() => setIsOpen(false)}
                  >
                    <FindingIcon />
                    <span>탐색하기</span>
                  </PopoverLink>

                  <PopoverSeparator />

                  {/* 프로필 정보 */}
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Image
                        src={'/img_header_profile.svg'}
                        alt="프로필 사진"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {session?.name || '사용자'}
                        </span>
                        {session?.role && (
                          <span className="text-xs text-gray-500">
                            {ROLE_META_MAP[session.role]?.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="mt-2 flex flex-col gap-1">
                    <PopoverItem
                      onClick={() => {
                        goToMypage();
                        setIsOpen(false);
                      }}
                    >
                      마이페이지
                    </PopoverItem>
                    <PopoverItem
                      variant="danger"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      로그아웃
                    </PopoverItem>
                  </div>

                  <div className="mt-2 flex flex-col gap-1">
                    <Link
                      href="https://forms.gle/ktLvekAsKTkqTcpQ6"
                      className="text-gray-scale-gray-30 flex items-center justify-end gap-1.5 text-sm font-semibold"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="/ic_question_mark.svg"
                        alt="피드백"
                        width={16}
                        height={16}
                      />
                      소중한 의견 보내기
                    </Link>
                  </div>
                </PopoverNav>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {!session && (
          <div className="flex gap-5">
            <Link
              href={PUBLIC.CORE.LOGIN}
              className={cn(
                BUTTON_BASE,
                'max-desktop:border-line-line1 max-desktop:py-2'
              )}
            >
              로그인
            </Link>
            <Link
              href={PUBLIC.CORE.SIGNUP}
              className={cn(
                BUTTON_BASE,
                'bg-key-color-primary hover:bg-key-color-secondary',
                'max-desktop:hidden'
              )}
            >
              디에듀 시작하기
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
