'use client';

import { useEffect, useReducer, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { StudyroomGroups } from '@/features/study-rooms/components/sidebar/groups';
import { InvitationDialog } from '@/features/study-rooms/components/student-invitation/InvitationDialog';
import {
  useStudentStudyRoomDetailQuery,
  useTeacherStudyRoomDetailQuery,
} from '@/features/study-rooms/hooks';
import { ColumnLayout } from '@/layout/column-layout';
import {
  InputDialog,
  StudyroomConfirmDialog,
} from '@/shared/components/dialog';
import {
  dialogReducer,
  initialDialogState,
} from '@/shared/components/dialog/model/dialog-reducer';
import { SidebarButton } from '@/shared/components/sidebar';
import { useRole } from '@/shared/hooks/use-role';

import { StudyRoomDetail } from '../../model';
import { StudyroomSidebarHeader } from './header';
import { useDeleteStudyRoom, useUpdateStudyRoom } from './services/query';
import { StudyIntro, StudyStats } from './status';

export const StudyroomSidebar = ({
  studyRoomId,
  segment,
  selectedGroupId,
  onSelectGroup,
}: {
  studyRoomId: number;
  segment: string | undefined;
  selectedGroupId: number | 'all';
  onSelectGroup: (id: number | 'all') => void;
}) => {
  const router = useRouter();

  // 초대 다이얼로그 open 확인
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOpenInvite = searchParams.get('invite') === 'open';

  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);
  const [deleteNoticeMsg, setDeleteNoticeMsg] =
    useState('수업노트 그룹이 삭제되었습니다.');
  const { role } = useRole();
  const { mutate: deleteStudyRoom } = useDeleteStudyRoom();
  const { mutate: updateRoomName } = useUpdateStudyRoom();

  // 스터디룸 상세 정보 조회 (선생님)
  const { data: teacherStudyRoomDetail } = useTeacherStudyRoomDetailQuery(
    studyRoomId,
    {
      enabled: role === 'ROLE_TEACHER',
    }
  );

  // 스터디룸 상세 정보 조회 (학생)
  const { data: studentStudyRoomDetail } = useStudentStudyRoomDetailQuery(
    studyRoomId,
    {
      enabled: role === 'ROLE_STUDENT',
    }
  );

  let studyRoomDetail: StudyRoomDetail | undefined;
  if (role === 'ROLE_TEACHER') studyRoomDetail = teacherStudyRoomDetail;
  if (role === 'ROLE_STUDENT') studyRoomDetail = studentStudyRoomDetail;

  // 삭제, 수정, 학생 초대 등 관리 권한
  const canManage = role === 'ROLE_TEACHER';

  // TODO: 스터디룸 이름 변경 API 연결
  const handleSubmitRoomRename = (name: string, others: StudyRoomDetail) => {
    updateRoomName(
      { studyRoomId, name, others },
      {
        onSuccess: () => {
          dispatch({ type: 'CLOSE' });
        },
      }
    );
  };

  // TODO: 스터디룸 삭제 API 연결
  const handleDeleteGroup = () => {
    deleteStudyRoom(
      { studyRoomId },
      {
        onSuccess: () => {
          setDeleteNoticeMsg('스터디룸이 삭제되었습니다.');
          dispatch({ type: 'GO_TO_CONFIRM' });
        },
      }
    );
  };
  const onConfirmDelete = () => {
    router.push('/dashboard');
  };

  // 초대 다이얼로그 열기
  const openInvitation = () => {
    const params = new URLSearchParams(searchParams);
    params.set('invite', 'open');
    router.replace(`${pathname}?${params.toString()}`);
  };

  // 초대 다이얼로그 닫기
  const closeInvitation = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('invite');
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ''}`);
  };

  useEffect(() => {
    if (isOpenInvite) {
      dispatch({
        type: 'OPEN',
        kind: 'invite',
        scope: 'studyroom',
      });
    } else {
      dispatch({ type: 'CLOSE' });
    }
  }, [isOpenInvite]);

  if (!segment) return null;
  return (
    <>
      {dialog.status === 'open' && dialog.kind === 'onConfirm' && (
        <StudyroomConfirmDialog
          type="confirm"
          open={true}
          dispatch={dispatch}
          description={deleteNoticeMsg}
          onConfirm={onConfirmDelete}
        />
      )}

      {dialog.status === 'open' &&
        dialog.kind === 'delete' &&
        dialog.scope === 'studyroom' && (
          <StudyroomConfirmDialog
            type="delete"
            open={true}
            dispatch={dispatch}
            onDelete={() => handleDeleteGroup()}
            title="스터디룸을 삭제하시겠습니까?"
            description="삭제된 스터디룸은 복구할 수 없습니다."
          />
        )}

      {dialog.status === 'open' &&
        dialog.kind === 'rename' &&
        dialog.scope === 'studyroom' &&
        studyRoomDetail && (
          <InputDialog
            isOpen={true}
            placeholder={studyRoomDetail?.name || ''}
            onOpenChange={() => dispatch({ type: 'CLOSE' })}
            title="스터디룸 이름 변경"
            onSubmit={(newName) =>
              handleSubmitRoomRename(newName, studyRoomDetail)
            }
          />
        )}

      {dialog.status === 'open' &&
        dialog.kind === 'invite' &&
        dialog.scope === 'studyroom' && (
          <InvitationDialog
            isOpen={true}
            title="스터디룸에 학생 초대"
            placeholder="초대할 학생을 검색 후 선택해 주세요."
            studyRoomId={studyRoomId}
            onOpenChange={closeInvitation}
          />
        )}

      <ColumnLayout.Left className="border-line-line1 flex h-fit flex-col gap-5 rounded-xl border bg-white px-8 py-8">
        <StudyroomSidebarHeader
          dispatch={dispatch}
          studyRoomId={studyRoomId}
          studyRoomName={studyRoomDetail?.name}
          teacherName={studyRoomDetail?.teacherName}
          canManage={canManage}
        />

        <StudyStats
          numberOfTeachingNote={studyRoomDetail?.numberOfTeachingNote}
          numberOfStudents={studyRoomDetail?.studentNames?.length}
          numberOfQuestion={studyRoomDetail?.numberOfQuestion}
        />
        <StudyIntro description={studyRoomDetail?.description} />
        {/* 학생 초대 버튼 - 선생님만 노출 */}
        {canManage && (
          <SidebarButton
            onClick={openInvitation}
            btnName="학생 초대하기"
            imgUrl="/studynotes/invite_student.svg"
          />
        )}
        {/* 수업노트 탭에서만 보이는 컴포넌트 */}
        {segment === 'note' && (
          <StudyroomGroups
            role={role}
            studyRoomId={studyRoomId}
            selectedGroupId={selectedGroupId}
            handleSelectGroupId={onSelectGroup}
          />
        )}
      </ColumnLayout.Left>
    </>
  );
};
