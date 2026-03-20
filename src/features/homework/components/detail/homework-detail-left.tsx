'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ColumnLayout } from '@/layout';
import {
  CheckRead,
  ReadPeopleList,
  useReadPeoplePopover,
} from '@/shared/components/check-read';
import { DialogAction, DialogState } from '@/shared/components/dialog';
import { DropdownMenu } from '@/shared/components/ui';
import { useRole } from '@/shared/hooks';
import { cn } from '@/shared/lib';

import { useStudentHomeworkDetail } from '../../hooks/student/useStudentHomeworkQuries';
import { useGetTeacherHomeworkDetail } from '../../hooks/teacher/useTeacherHomeworkQuries';
import { HomeworkDialog } from '../dialog';

type Props = {
  studyRoomId: number;
  homeworkId: number;
  dialog: DialogState;
  dispatch: (action: DialogAction) => void;
};

export const HomeworkDetailLeft = ({
  studyRoomId,
  homeworkId,
  dialog,
  dispatch,
}: Props) => {
  const router = useRouter();
  const { role } = useRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const teacherQuery = useGetTeacherHomeworkDetail(studyRoomId, homeworkId);
  const studentQuery = useStudentHomeworkDetail(studyRoomId, homeworkId);

  const data = role === 'ROLE_TEACHER' ? teacherQuery.data : studentQuery.data;
  const isPending =
    role === 'ROLE_TEACHER' ? teacherQuery.isPending : studentQuery.isPending;
  const isError =
    role === 'ROLE_TEACHER' ? teacherQuery.isError : studentQuery.isError;

  const { isOpen, side, triggerRef, popupRef, open, close } =
    useReadPeoplePopover();

  // 읽은 사람 조회
  const readPeopleItems =
    role === 'ROLE_TEACHER'
      ? teacherQuery.data?.homeworkStudents
          .filter((student) => student.readAt != null)
          .map((student) => ({
            id: student.studentId,
            name: student.studentName,
            readAt: student.readAt,
          }))
      : studentQuery.data?.otherHomeworkStudents
          .filter((student) => student.readAt != null)
          .map((student, index) => ({
            id: index,
            name: student.studentName,
            readAt: student.readAt,
          }));

  const readCount =
    role === 'ROLE_TEACHER'
      ? (teacherQuery.data?.homeworkStudents.filter(
          (student) => student.readAt != null
        ).length ?? 0)
      : (studentQuery.data?.otherHomeworkStudents.filter(
          (student) => student.readAt != null
        ).length ?? 0);

  // 마감기한 계산
  const deadLineTime = (time?: string) => {
    if (!time) return '없음';

    const date = new Date(time);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const period = hours < 12 ? '오전' : '오후';
    hours = hours % 12 || 12;

    return `${year}.${month}.${day} ${period} ${hours}시 ${minutes}분`;
  };

  // 진행중 or 마감
  const isDone = () => {
    if (!data?.homework.deadline) return false;

    const today = new Date();

    const deadlineDate = new Date(data.homework.deadline);

    return today >= deadlineDate;
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    router.push(`/study-rooms/${studyRoomId}/homework/${homeworkId}/edit`);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    dispatch({
      type: 'OPEN',
      scope: 'homework',
      kind: 'delete',
      payload: {
        homeworkId: homeworkId,
      },
    });
  };

  const onPushList = () => {
    router.push(`/study-rooms/${studyRoomId}/homework`);
  };

  if (isPending) return <div>로딩중...</div>;

  return (
    <>
      <HomeworkDialog
        state={dialog}
        dispatch={dispatch}
        studyRoomId={studyRoomId}
        homeworkId={homeworkId}
        onPushList={onPushList}
      />
      <ColumnLayout.Left className="rounded-[12px] bg-white">
        <div className="border-line-line1 flex flex-col gap-5 rounded-xl border bg-white p-10">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'font-body1-normal',
                isDone()
                  ? 'text-orange-scale-orange-50'
                  : 'text-gray-scale-gray-60'
              )}
            >
              {isDone() ? '마감' : '진행중'}
            </span>
            {role === 'ROLE_TEACHER' && (
              <DropdownMenu
                open={isMenuOpen}
                onOpenChange={setIsMenuOpen}
              >
                <DropdownMenu.Trigger className="flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-gray-100">
                  <Image
                    src="/studynotes/gray-kebab.svg"
                    width={24}
                    height={24}
                    alt="homework"
                    className="cursor-pointer"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="flex min-w-[110px] flex-col items-stretch">
                  <DropdownMenu.Item
                    className="justify-center"
                    onClick={handleEdit}
                  >
                    {'수정하기'}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="justify-center"
                    variant="danger"
                    onClick={handleDelete}
                  >
                    {'삭제하기'}
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            )}
          </div>
          <div>
            마감 기한 :{' '}
            <span className="text-gray-scale-gray-70vhh">
              {deadLineTime(data?.homework.deadline ?? '없음')}
            </span>
          </div>
          <h3 className="font-headline1-heading">{data?.homework.title}</h3>

          {/* 본 인원 수 체크 */}
          {readCount > 0 && (
            <div
              ref={triggerRef}
              onMouseEnter={open}
              onMouseLeave={close}
              className="relative"
            >
              <div className="flex items-center justify-end gap-1 text-center">
                <Image
                  src="/studynotes/eye.png"
                  alt="eye"
                  width={24}
                  height={24}
                />
                <p className="font-label-normal text-gray-7">
                  {readCount}명이 봤어요
                </p>
                {isOpen ? (
                  <CheckRead
                    side={side}
                    popupRef={popupRef}
                    open={open}
                    close={close}
                  >
                    <ReadPeopleList
                      displayReadCount={readCount}
                      data={readPeopleItems}
                      isLoading={isPending}
                      isError={isError}
                    />
                  </CheckRead>
                ) : null}
              </div>
            </div>
          )}
          <hr className="text-gray-scale-gray-10" />
          <div className="font-label-normal flex cursor-default flex-col gap-2">
            <div className="bg-gray-scale-gray-1 text-gray-scale-gray-70 flex w-fit items-center gap-1 rounded-sm px-2 py-1">
              <Image
                src="/homework/link.svg"
                width={14}
                height={14}
                alt="study-notes"
                className="h-[14px] w-[14px]"
              />
              <span>연결 수업노트</span>
            </div>
            <div>
              {data?.homework.teachingNoteInfoList.length === 0 ? (
                <div>없음</div>
              ) : (
                data?.homework.teachingNoteInfoList.map((note) => (
                  <div key={note.id}>
                    <a
                      href={`/study-rooms/${studyRoomId}/note/${note.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-scale-orange-50 cursor-pointer"
                    >
                      {note.name}
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </ColumnLayout.Left>
    </>
  );
};
