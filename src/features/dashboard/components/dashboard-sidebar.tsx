'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  useStudentStudyRoomsQuery,
  useTeacherStudyRoomsQuery,
} from '@/features/study-rooms';
import {
  FindingIcon,
  HomeIcon,
  ListIcon,
  NotepadIcon,
  PlusIcon,
} from '@/shared/components/icons';
import { Sidebar } from '@/shared/components/sidebar';
import { PRIVATE, PUBLIC } from '@/shared/constants/route';
import { useRole } from '@/shared/hooks/use-role';
import { trackGnbLogoutClick } from '@/shared/lib/analytics';
import { LogOut, ShieldUserIcon, User2Icon } from 'lucide-react';

export const DashboardSidebar = () => {
  // [CRITICAL TODO: API 구현 누락] useDashboardQuery의 데이터(data)를 사용할 수 있도록 백엔드 API 및 바인딩 작업을 즉시 진행해야 합니다.
  // const { data, isLoading, isError } = useDashboardQuery();

  const { role } = useRole();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    trackGnbLogoutClick(role ?? null);
  };

  /* ─────────────────────────────────────────────────────
   * 역할에 따라 다른 쿼리 사용
   * ────────────────────────────────────────────────────*/
  const { data: teacherStudyRoomList } = useTeacherStudyRoomsQuery({
    enabled: role === 'ROLE_TEACHER',
  });

  const { data: studentStudyRoomList } = useStudentStudyRoomsQuery({
    enabled: role === 'ROLE_STUDENT',
  });

  // 역할에 따라 적절한 리스트 선택
  const studyRoomList =
    role === 'ROLE_TEACHER'
      ? teacherStudyRoomList
      : role === 'ROLE_STUDENT'
        ? studentStudyRoomList
        : undefined;

  return (
    <Sidebar>
      {/* 대시보드 */}
      <Sidebar.Item href={PRIVATE.DASHBOARD.INDEX}>
        <HomeIcon />
        <Sidebar.Text>대시보드</Sidebar.Text>
      </Sidebar.Item>

      <Sidebar.Header>
        <div className="flex items-center gap-2">
          <Sidebar.SectionIcon />
          <Sidebar.HeaderText>스터디룸</Sidebar.HeaderText>
        </div>
        {/* 선생님만 스터디룸 생성 버튼 표시 */}
        {role === 'ROLE_TEACHER' && (
          <Sidebar.Item
            href={PRIVATE.ROOM.CREATE}
            className="h-9 w-9 justify-center bg-transparent px-0"
          >
            <PlusIcon />
            <span className="sr-only">스터디룸 생성</span>
          </Sidebar.Item>
        )}
      </Sidebar.Header>

      <Sidebar.ScrollArea>
        <Sidebar.List>
          {studyRoomList?.map((item) => (
            <Sidebar.ListItem
              key={item.id}
              item={{
                id: item.id,
                text: item.name,
              }}
            />
          ))}
        </Sidebar.List>
      </Sidebar.ScrollArea>

      {role === 'ROLE_ADMIN' && (
        <>
          <Sidebar.Header>
            <div className="flex items-center gap-2">
              <ShieldUserIcon />
              <Sidebar.HeaderText>관리자</Sidebar.HeaderText>
            </div>
          </Sidebar.Header>

          <Sidebar.List>
            <li>
              <Sidebar.Item
                href={PRIVATE.ADMIN.COLUMN.LIST}
                matchPath={PRIVATE.ADMIN.COLUMN.LIST}
                className="h-12 items-center justify-start gap-[2px]"
              >
                <ListIcon />
                <Sidebar.Text className="font-body2-normal">
                  칼럼 관리
                </Sidebar.Text>
              </Sidebar.Item>
            </li>
          </Sidebar.List>
        </>
      )}

      <Sidebar.Item
        href={PUBLIC.CORE.LIST.TEACHERS}
        matchPath={PUBLIC.CORE.LIST.BASE}
      >
        <FindingIcon className="shrink-0" />
        <Sidebar.Text>탐색하기</Sidebar.Text>
      </Sidebar.Item>

      <Sidebar.Item
        href={PUBLIC.COMMUNITY.COLUMN.LIST}
        matchPath={PUBLIC.COMMUNITY.BASE}
      >
        <NotepadIcon className="shrink-0" />
        <Sidebar.Text>게시판</Sidebar.Text>
      </Sidebar.Item>

      <Sidebar.Item
        href={PRIVATE.MYPAGE}
        matchPath={PRIVATE.MYPAGE}
      >
        <User2Icon className="shrink-0" />
        <Sidebar.Text>마이페이지</Sidebar.Text>
      </Sidebar.Item>

      <div className="mt-auto flex justify-end p-2">
        <button
          type="button"
          onClick={handleLogout}
          className="text-text-sub2 hover:bg-background-gray font-body2-normal flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1"
        >
          <Sidebar.Text>로그아웃</Sidebar.Text>
          <LogOut size={20} />
        </button>
      </div>
    </Sidebar>
  );
};
