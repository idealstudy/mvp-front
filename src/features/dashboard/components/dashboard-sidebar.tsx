'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { createStudentStudyRoomApi } from '@/features/study-rooms/api/room.api.student';
import { createTeacherStudyRoomApi } from '@/features/study-rooms/api/room.api.teacher';
import { createStudentStudyRoomHooks } from '@/features/study-rooms/hooks/room.query.hooks.student';
import { createTeacherStudyRoomHooks } from '@/features/study-rooms/hooks/room.query.hooks.teacher';
import { ListIcon, NotepadIcon } from '@/shared/components/icons';
import { Sidebar } from '@/shared/components/sidebar/sidebar';
import { PRIVATE, PUBLIC } from '@/shared/constants/route';
import { useMediaQuery } from '@/shared/hooks';
import { useRole } from '@/shared/hooks/use-role';
import { trackGnbLogoutClick } from '@/shared/lib/analytics';
import {
  Compass,
  House,
  LogOut,
  Plus,
  ShieldUserIcon,
  User2Icon,
} from 'lucide-react';

const STUDY_ROOM_SKELETON_COUNT = 3;
const DESKTOP_MEDIA_QUERY = '(min-width: 1200px)';
const studentStudyRoomApi = createStudentStudyRoomApi();
const teacherStudyRoomApi = createTeacherStudyRoomApi();
const { useStudentStudyRoomsQuery } =
  createStudentStudyRoomHooks(studentStudyRoomApi);
const { useTeacherStudyRoomsQuery } =
  createTeacherStudyRoomHooks(teacherStudyRoomApi);

export const DashboardSidebar = () => {
  // [CRITICAL TODO: API 구현 누락] 역할별 대시보드 쿼리 데이터를 사용할 수 있도록 백엔드 API 및 바인딩 작업을 진행해야 합니다.

  const { role, isLoading: isRoleLoading } = useRole();
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    trackGnbLogoutClick(role ?? null);
  };

  /* ─────────────────────────────────────────────────────
   * 역할에 따라 다른 쿼리 사용
   * ────────────────────────────────────────────────────*/
  const {
    data: teacherStudyRoomList,
    isPending: isTeacherStudyRoomListPending,
  } = useTeacherStudyRoomsQuery({
    enabled: isDesktop && role === 'ROLE_TEACHER',
  });

  const {
    data: studentStudyRoomList,
    isPending: isStudentStudyRoomListPending,
  } = useStudentStudyRoomsQuery({
    enabled: isDesktop && role === 'ROLE_STUDENT',
  });

  const getStudyRoomList = () => {
    switch (role) {
      case 'ROLE_TEACHER':
        return teacherStudyRoomList;
      case 'ROLE_STUDENT':
        return studentStudyRoomList;
      default:
        return undefined;
    }
  };

  const getIsStudyRoomListPending = () => {
    switch (role) {
      case 'ROLE_TEACHER':
        return isTeacherStudyRoomListPending;
      case 'ROLE_STUDENT':
        return isStudentStudyRoomListPending;
      default:
        return false;
    }
  };

  const studyRoomList = getStudyRoomList();
  const isStudyRoomListPending = getIsStudyRoomListPending();
  const shouldShowStudyRoomHeader = role !== 'ROLE_PARENT';
  const shouldShowStudyRoomNavigation =
    isRoleLoading || role === 'ROLE_TEACHER' || role === 'ROLE_STUDENT';

  return (
    <Sidebar>
      {/* 대시보드 */}
      <Sidebar.Item
        href={PRIVATE.DASHBOARD.INDEX}
        matchPath={PRIVATE.DASHBOARD.INDEX}
      >
        <House className="shrink-0" />
        <Sidebar.Text>대시보드</Sidebar.Text>
      </Sidebar.Item>

      {/* 부모에겐 보여주지 않기 */}
      {shouldShowStudyRoomHeader && (
        <Sidebar.Header>
          <div className="flex items-center gap-2">
            <Sidebar.SectionIcon />
            <Sidebar.HeaderText>스터디룸</Sidebar.HeaderText>
          </div>
          {/* 선생님만 스터디룸 생성 버튼 표시 */}
          {role === 'ROLE_TEACHER' && (
            <Sidebar.Item
              href={PRIVATE.ROOM.CREATE}
              prefetch={false}
              className="h-9 w-9 justify-center bg-transparent px-0"
            >
              <Plus />
              <span className="sr-only">스터디룸 생성</span>
            </Sidebar.Item>
          )}
        </Sidebar.Header>
      )}

      {shouldShowStudyRoomNavigation && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Sidebar.List>
            {isStudyRoomListPending
              ? Array.from({ length: STUDY_ROOM_SKELETON_COUNT }).map(
                  (_, index) => (
                    <li key={index}>
                      <div className="flex min-h-[58px] items-center gap-2 rounded-lg px-5">
                        <div className="bg-gray-3 h-5 w-5 shrink-0 animate-pulse rounded" />
                        <div className="bg-gray-3 h-4 w-32 animate-pulse rounded" />
                      </div>
                    </li>
                  )
                )
              : studyRoomList?.map((item) => (
                  <Sidebar.ListItem
                    key={item.id}
                    item={{
                      id: item.id,
                      text: item.name,
                    }}
                  />
                ))}
          </Sidebar.List>
        </div>
      )}

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
        href={PUBLIC.CORE.LIST.STUDY_ROOMS}
        prefetch={false}
        matchPath={PUBLIC.CORE.LIST.BASE}
      >
        <Compass className="shrink-0" />
        <Sidebar.Text>탐색하기</Sidebar.Text>
      </Sidebar.Item>

      <Sidebar.Item
        href={PUBLIC.COMMUNITY.COLUMN.LIST}
        prefetch={false}
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
