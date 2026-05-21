'use client';

import { ReactNode, createContext, useContext } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ListIcon, TextIcon } from '@/shared/components/icons';
import { PRIVATE } from '@/shared/constants/route';
import { cn } from '@/shared/lib';

/* ─────────────────────────────────────────────────────
 * Sidebar Context & Hook (상태 중앙 관리)
 * ────────────────────────────────────────────────────*/
interface SidebarContextValue {
  pathname: string | null;
  isStudyRoomSectionActive: boolean;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined
);

const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isStudyRoomSectionActive =
    pathname?.startsWith('/dashboard/study-rooms') || false;

  const value = {
    pathname,
    isStudyRoomSectionActive,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
};

/* ─────────────────────────────────────────────────────
 * Sidebar.Root
 * ────────────────────────────────────────────────────*/
const SidebarRoot = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={cn(
        'top-header-height fixed left-0 z-50 hidden h-[calc(100dvh-var(--spacing-header-height))] flex-col py-3',
        'desktop:flex'
      )}
    >
      <aside className="bg-system-background-alt w-sidebar-width relative flex-1 flex-col overflow-hidden rounded-r-[12px] border-y border-r border-[#D9D9D9] p-3">
        {children}
      </aside>
    </div>
  );
};

/* ─────────────────────────────────────────────────────
 * Sidebar.Item(Context로 isActive 계산)
 * ────────────────────────────────────────────────────*/
type SidebarItemProps = {
  href: string;
  children: ReactNode;
  prefetch?: boolean;
  className?: string;
  isActive?: boolean;
  matchPath?: string;
};

const SidebarItem = ({
  href,
  prefetch,
  children,
  className,
  isActive: propIsActive,
  matchPath,
}: SidebarItemProps) => {
  const { pathname } = useSidebarContext();
  const isActive =
    propIsActive ??
    (matchPath ? pathname?.startsWith(matchPath) : pathname === href);

  const isCreatePage = href === PRIVATE.ROOM.CREATE;

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn(
        'flex min-h-[58px] items-center gap-2 rounded-lg px-5 font-bold',
        isActive
          ? 'text-key-color-primary bg-[#FFF4F1]'
          : 'hover:bg-gray-scale-gray-5',
        isCreatePage && 'h-9 w-9 justify-center gap-0 bg-transparent px-0',
        className
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
};

/* ─────────────────────────────────────────────────────
 * Sidebar.List
 * ────────────────────────────────────────────────────*/
interface BaseSidebarItem {
  id: number;
  text: string;
  // href는 내부에서 item.id로 자동 생성되므로 필요 없음
}

interface CommonRoomFields {
  id: number;
  name?: string;
  text?: string;
}

type SidebarListProps<TItem extends BaseSidebarItem> = {
  listData?: TItem[];
  children?: ReactNode;
};

// item이 객체이고, id가 숫자이며, name 또는 text 중 하나를 가지고 있는지 확인
function isSidebarStudyRoomItem(item: unknown): item is CommonRoomFields {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  if (!('id' in item) || typeof item.id !== 'number') {
    return false;
  }

  const hasValidName = 'name' in item && typeof item.name === 'string';
  const hasValidText = 'text' in item && typeof item.text === 'string';
  return hasValidName || hasValidText;
}

const SidebarList = <TItem extends BaseSidebarItem>({
  listData,
  children,
}: SidebarListProps<TItem>) => {
  // case1. children이 있을경우
  if (children) {
    return <ul className="flex flex-col">{children}</ul>;
  }

  // case2. 인자로 받은경우
  else if (listData && Array.isArray(listData)) {
    const safeList = listData.filter(isSidebarStudyRoomItem);
    return (
      <ul className="flex flex-col">
        {safeList.map((item) => (
          <Sidebar.ListItem
            key={item.id}
            item={item}
          />
        ))}
      </ul>
    );
  }

  // case3. 아무것도 없는경우
  return <ul className="flex flex-col" />;
};

const SidebarScrollArea = ({ children }: { children: ReactNode }) => {
  return <div className="max-h-none min-h-0 overflow-y-auto">{children}</div>;
};

/* ─────────────────────────────────────────────────────
 * Sidebar.ListItem(스터디룸 목록 개별 아이템)
 * ────────────────────────────────────────────────────*/
const SidebarListItem = ({ item }: { item: BaseSidebarItem }) => {
  const { pathname } = useSidebarContext();
  // item.id를 사용해서 자동으로 상세 페이지 경로 생성
  const detailHref = PRIVATE.ROOM.DETAIL(item.id);
  const roomBasePath = `/study-rooms/${item.id}`;
  const isActive = pathname?.startsWith(roomBasePath) ?? false;
  return (
    <li>
      <Sidebar.Item
        href={detailHref}
        prefetch={false}
        isActive={isActive}
        className="h-12 items-center justify-start gap-[2px]"
      >
        <ListIcon
          className={cn(
            'StudyRoomListIcon ml-[2px] shrink-0',
            isActive && 'text-key-color-primary'
          )}
        />
        <Sidebar.Text className="font-body2-normal max-w-[173px] shrink-0 truncate text-left">
          <span title={item.text}>{item.text}</span>
        </Sidebar.Text>
      </Sidebar.Item>
    </li>
  );
};

/* ─────────────────────────────────────────────────────
 * Sidebar.Header 및 관련 컴포넌트(Context로 active 상태 처리)
 * ────────────────────────────────────────────────────*/
const SidebarHeader = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-[58px] w-full items-center justify-between pr-[10px] pl-5">
      {children}
    </div>
  );
};

const SidebarHeaderText = ({ children }: { children: ReactNode }) => {
  const { isStudyRoomSectionActive } = useSidebarContext();
  return (
    <p
      className={cn(
        'pointer-events-none font-bold select-none',
        isStudyRoomSectionActive && 'text-key-color-primary'
      )}
    >
      {children}
    </p>
  );
};

const SidebarSectionIcon = ({ className }: { className?: string }) => {
  const { isStudyRoomSectionActive } = useSidebarContext();
  return (
    <TextIcon
      className={cn(
        isStudyRoomSectionActive && 'text-key-color-primary',
        className
      )}
    />
  );
};

/* ─────────────────────────────────────────────────────
 * Sidebar.Text
 * ────────────────────────────────────────────────────*/
const SidebarItemText = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <span className={cn('relative', className)}>{children}</span>;
};

const Sidebar = ({ children }: { children: ReactNode }) => (
  <Sidebar.Provider>
    <Sidebar.Root>
      <nav className="flex h-full flex-1 flex-col">{children}</nav>
    </Sidebar.Root>
  </Sidebar.Provider>
);

Sidebar.Provider = SidebarProvider;
Sidebar.Root = SidebarRoot;
Sidebar.Item = SidebarItem;
Sidebar.Text = SidebarItemText;
Sidebar.List = SidebarList;
Sidebar.ListItem = SidebarListItem;
Sidebar.Header = SidebarHeader;
Sidebar.HeaderText = SidebarHeaderText;
Sidebar.SectionIcon = SidebarSectionIcon;
Sidebar.ScrollArea = SidebarScrollArea;

export { Sidebar };
