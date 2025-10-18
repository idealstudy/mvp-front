'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ROUTE } from '@/constants/route';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const pathname = usePathname();
  const isStudyRoomActive = pathname?.startsWith('/dashboard/study-rooms');

  /* 더미 데이터: 실제에선 서버/쿼리로 대체 */
  const studyRoomList = [
    {
      id: 1,
      text: '나의 첫 스터디룸나의 첫 스터디룸나의 첫 스터디룸나의 첫 스터디룸나의 첫 스터디룸',
    },
    {
      id: 2,
      text: '은광여고 여름방학 특강반나의 첫 스터디룸나의 첫 스터디룸나의 첫 스터디룸나의 첫 스터디룸나의 첫 스터디룸',
    },
    { id: 3, text: '오버플로우 확인용 오버플로우 확인용' },
  ];

  return (
    <div
      className={cn(
        'top-header-height fixed left-0 hidden h-[calc(100dvh-var(--spacing-header-height))] flex-col py-3',
        'desktop:flex'
      )}
    >
      <aside className="bg-system-background-alt w-sidebar-width relative flex-1 flex-col overflow-y-auto rounded-r-[12px] border-y border-r border-[#D9D9D9] p-3">
        <nav className="flex h-full flex-1 flex-col">
          {/* 홈 */}
          <SidebarItem href={ROUTE.DASHBOARD.HOME}>
            <HomeTextIcon />
            <SidebarItemText>홈</SidebarItemText>
          </SidebarItem>

          {/* 스터디룸 헤더 + 생성 버튼 */}
          <div className="flex h-[58px] w-full items-center justify-between pr-[10px] pl-5">
            <div className="flex items-center gap-2">
              <StudyTextIcon
                className={cn(isStudyRoomActive && 'text-key-color-primary')}
              />
              <p
                className={cn(
                  'pointer-events-none font-bold select-none',
                  isStudyRoomActive && 'text-key-color-primary'
                )}
              >
                스터디룸
              </p>
            </div>
            <SidebarItem
              href={ROUTE.DASHBOARD.STUDYROOM.CREATE}
              className="h-9 w-9 justify-center bg-transparent px-0"
            >
              <StudyRoomPlusIcon />
              <span className="sr-only">스터디룸 생성</span>
            </SidebarItem>
          </div>

          {/* 스터디룸 리스트 */}
          <ul className="flex flex-col">
            {studyRoomList.map((item) => {
              const detailHref = ROUTE.DASHBOARD.STUDYROOM.DETAIL(item.id);
              const isActive = pathname === detailHref;

              return (
                <li key={item.id}>
                  <SidebarItem
                    href={detailHref}
                    className="h-12 items-center justify-start gap-[2px]"
                  >
                    <StudyRoomListIcon
                      className={cn(
                        'ml-[2px] shrink-0',
                        isActive && 'text-key-color-primary'
                      )}
                    />
                    <SidebarItemText className="font-body2-normal max-w-[173px] shrink-0 truncate text-left">
                      <span title={item.text}>{item.text}</span>
                    </SidebarItemText>
                  </SidebarItem>
                </li>
              );
            })}
          </ul>

          {/* 환경설정 */}
          <SidebarItem href={ROUTE.DASHBOARD.SETTINGS}>
            <SettingsIcon />
            <SidebarItemText>환경설정</SidebarItemText>
          </SidebarItem>

          {/* 하단 고정: 문의하기 */}
          <div className="absolute right-0 bottom-0 p-4">
            <Link
              href={ROUTE.DASHBOARD.SETTINGS}
              className="text-gray-scale-gray-50 hover:bg-gray-scale-gray-5 flex items-center gap-2 rounded-lg text-[14px] font-semibold"
            >
              <SidebarItemText>디에듀에 문의하기</SidebarItemText>
              <Image
                src="/ic_question_mark.svg"
                alt="디에듀에 문의하기 아이콘"
                width={16}
                height={16}
              />
            </Link>
          </div>
        </nav>
      </aside>
    </div>
  );
};

type SidebarItemProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

const SidebarItem = ({ href, children, className }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const isCreatePage = href === ROUTE.DASHBOARD.STUDYROOM.CREATE;

  return (
    <Link
      href={href}
      className={cn(
        'flex h-[58px] items-center gap-2 rounded-lg px-5 font-bold',
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

const SidebarItemText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <span className={cn('relative', className)}>{children}</span>;
};

const HomeTextIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.8848 19.2949C19.8848 20.3995 18.9893 21.2949 17.8848 21.2949H5.88477C4.7802 21.2949 3.88477 20.3995 3.88477 19.2949V10.6551C3.88477 10.1023 4.11358 9.57415 4.51687 9.19606L10.5112 3.57625C11.2801 2.85545 12.4763 2.85494 13.2458 3.57509L19.2514 9.19591C19.6555 9.57406 19.8848 10.1027 19.8848 10.6561V19.2949Z" />
      <path
        d="M12 15V20"
        strokeLinecap="round"
      />
    </svg>
  );
};

const StudyTextIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2L20.6603 7V17L12 22L3.33975 17V7L12 2Z"
        strokeLinejoin="round"
      />
      <path
        d="M20 16.5L12.0001 12L4 16.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const StudyRoomListIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="8"
        cy="8"
        r="2"
        fill="currentColor"
      />
    </svg>
  );
};

const SettingsIcon = () => {
  return (
    <svg
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.05029 11C6.05029 8.81848 7.81876 7.05 10.0003 7.05C12.1818 7.05 13.9503 8.81848 13.9503 11C13.9503 13.1815 12.1818 14.95 10.0003 14.95C7.81876 14.95 6.05029 13.1815 6.05029 11ZM10.0003 8.95C8.8681 8.95 7.95029 9.86782 7.95029 11C7.95029 12.1322 8.8681 13.05 10.0003 13.05C11.1325 13.05 12.0503 12.1322 12.0503 11C12.0503 9.86782 11.1325 8.95 10.0003 8.95Z"
        fill="currentColor"
        strokeWidth="0"
      />
      <path
        d="M8.13152 0.970789C8.73804 0.858415 9.36275 0.799805 10.0003 0.799805C10.6378 0.799805 11.2625 0.858414 11.8691 0.970786C12.9105 1.16373 13.3507 2.11319 13.4931 2.70446C13.5895 3.10473 13.842 3.46312 14.2251 3.68433C14.608 3.90536 15.0441 3.94495 15.4387 3.82865C16.022 3.65674 17.0619 3.56445 17.7495 4.36716C18.5595 5.31261 19.1998 6.40878 19.6227 7.60855C19.9741 8.60576 19.373 9.45989 18.9327 9.87827C18.6343 10.1619 18.4501 10.5597 18.4501 11.0022C18.4501 11.4444 18.634 11.842 18.9322 12.1256C19.3723 12.5442 19.973 13.3986 19.6211 14.3956C19.1969 15.5973 18.5545 16.695 17.742 17.6412C17.0555 18.4408 16.019 18.3502 15.4367 18.1795C15.0427 18.064 14.6075 18.1039 14.2254 18.3245C13.8434 18.545 13.5913 18.9019 13.4943 19.3007C13.3508 19.8905 12.91 20.8357 11.8717 21.0283C11.2643 21.141 10.6388 21.1998 10.0003 21.1998C9.362 21.1998 8.73658 21.1411 8.12939 21.0284C7.09068 20.8358 6.64999 19.89 6.50661 19.3001C6.40964 18.9012 6.1575 18.5441 5.77537 18.3235C5.39318 18.1028 4.95782 18.063 4.56379 18.1786C3.98134 18.3494 2.94445 18.4403 2.25778 17.6403C1.44621 16.6949 0.804334 15.5983 0.380306 14.3978C0.0281791 13.4009 0.628571 12.5464 1.06853 12.1277C1.36648 11.8442 1.55026 11.4467 1.55026 11.0046C1.55026 10.5621 1.36603 10.1641 1.06744 9.88052C0.627088 9.46225 0.0258685 8.60831 0.377022 7.61109C0.799615 6.41098 1.43987 5.31446 2.24972 4.36869C2.93747 3.56551 3.97794 3.658 4.56131 3.83006C4.95595 3.94645 5.39225 3.90689 5.77517 3.68582C6.1585 3.4645 6.41106 3.10587 6.50733 2.70537C6.64952 2.11389 7.08966 1.16382 8.13152 0.970789ZM8.49916 2.83504C8.4948 2.83949 8.48871 2.84629 8.48093 2.85628C8.43907 2.91001 8.38813 3.01039 8.3547 3.14947C8.14172 4.03543 7.57812 4.83881 6.72516 5.33126C5.87316 5.82317 4.89682 5.90993 4.02382 5.65245C3.88684 5.61205 3.77457 5.60604 3.70706 5.61545C3.6942 5.61725 3.6851 5.61918 3.679 5.62077C3.03035 6.38223 2.51734 7.26159 2.17645 8.22152C2.17812 8.2275 2.18096 8.23613 2.1857 8.2478C2.21124 8.31067 2.27249 8.40465 2.37595 8.50291C3.03647 9.13031 3.45025 10.0199 3.45025 11.0046C3.45025 11.9881 3.03748 12.8768 2.37836 13.5041C2.275 13.6024 2.21384 13.6965 2.18836 13.7594C2.18363 13.771 2.1808 13.7797 2.17914 13.7856C2.52119 14.7459 3.03553 15.6253 3.68559 16.3866C3.69166 16.3881 3.70072 16.3901 3.71352 16.3919C3.78068 16.4013 3.89245 16.3954 4.02905 16.3554C4.90078 16.0997 5.87501 16.1871 6.72536 16.678C7.57559 17.1689 8.13834 17.9688 8.35285 18.8514C8.38653 18.9899 8.43746 19.0897 8.4792 19.1431C8.48695 19.1531 8.49302 19.1598 8.49737 19.1642C8.98413 19.2532 9.48636 19.2998 10.0003 19.2998C10.5144 19.2998 11.0167 19.2532 11.5036 19.1642C11.508 19.1597 11.514 19.153 11.5218 19.1431C11.5635 19.0897 11.6144 18.99 11.6481 18.8515C11.8628 17.9692 12.4255 17.1697 13.2754 16.679C14.1256 16.1882 15.0995 16.1007 15.9711 16.3562C16.1076 16.3962 16.2193 16.402 16.2864 16.3926C16.2992 16.3908 16.3083 16.3889 16.3144 16.3873C16.9651 15.6254 17.4799 14.7451 17.8221 13.7839C17.8204 13.7779 17.8176 13.7692 17.8129 13.7576C17.7874 13.6947 17.7262 13.6007 17.6228 13.5023C16.9632 12.875 16.5501 11.986 16.5501 11.0022C16.5501 10.0177 16.9637 9.12829 17.6239 8.50092C17.7274 8.40263 17.7886 8.30862 17.8142 8.24574C17.8189 8.23408 17.8217 8.22544 17.8234 8.21946C17.4823 7.2598 16.9692 6.38071 16.3205 5.61951C16.3144 5.61792 16.3053 5.61599 16.2925 5.6142C16.225 5.60479 16.1128 5.61078 15.9759 5.65113C15.103 5.90841 14.1269 5.82157 13.2751 5.32978C12.4226 4.83756 11.8591 4.0347 11.6459 3.14925C11.6124 3.01024 11.5615 2.90995 11.5196 2.85626C11.5119 2.84628 11.5058 2.83949 11.5014 2.83504C11.0152 2.74629 10.5136 2.6998 10.0003 2.6998C9.48699 2.6998 8.98536 2.74629 8.49916 2.83504ZM17.8257 8.2087L17.8254 8.21084L17.8257 8.2087ZM17.8243 13.7946L17.8241 13.7925L17.8243 13.7946ZM2.17688 13.7964L2.17711 13.7943L2.17688 13.7964ZM2.17418 8.21077L2.17442 8.21292L2.17418 8.21077Z"
        fill="currentColor"
        strokeWidth="0"
      />
    </svg>
  );
};

const StudyRoomPlusIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 13.5L7.5 8L13 8M7.5 2.5L7.49948 8.00052L2 8"
        stroke="#7C7C7C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
