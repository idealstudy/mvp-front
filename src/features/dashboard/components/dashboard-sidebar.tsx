'use client';

import Image from 'next/image';

import {
  useStudentStudyRoomsQuery,
  useTeacherStudyRoomsQuery,
} from '@/features/study-rooms';
import {
  FindingIcon,
  HomeIcon,
  ListIcon,
  PlusIcon,
} from '@/shared/components/icons';
import { Sidebar } from '@/shared/components/sidebar';
import { PRIVATE, PUBLIC } from '@/shared/constants/route';
import { useRole } from '@/shared/hooks/use-role';
import { ShieldUserIcon } from 'lucide-react';

export const DashboardSidebar = () => {
  // [CRITICAL TODO: API 구현 누락] useDashboardQuery의 데이터(data)를 사용할 수 있도록 백엔드 API 및 바인딩 작업을 즉시 진행해야 합니다.
  // const { data, isLoading, isError } = useDashboardQuery();

  const { role } = useRole();

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
                matchPath="/admin/columns"
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
        matchPath="/list"
      >
        <FindingIcon className="shrink-0" />

        <Sidebar.Text>탐색하기</Sidebar.Text>
      </Sidebar.Item>

      {/* 기능 추가 전까지 잠시 주석 (private -> dashboard 안에 있는 settings 페이지도 삭제 완) */}
      {/* <Sidebar.Item href={PRIVATE.DASHBOARD.SETTINGS}>
        <SettingIcon />
        <Sidebar.Text>환경설정</Sidebar.Text>
      </Sidebar.Item> */}
      <div className="mt-auto flex justify-end p-4">
        <a
          href={'https://pf.kakao.com/_LMcpn'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-scale-gray-50 hover:bg-gray-scale-gray-5 flex items-center gap-2 rounded-lg text-[14px] font-semibold"
        >
          <Sidebar.Text>디에듀에 문의하기</Sidebar.Text>
          <Image
            src="/ic_question_mark.svg"
            alt="디에듀에 문의하기 아이콘"
            width={16}
            height={16}
          />
        </a>
      </div>
    </Sidebar>
  );
};
