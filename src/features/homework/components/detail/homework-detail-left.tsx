'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ColumnLayout } from '@/layout';
import { DialogAction, DialogState } from '@/shared/components/dialog';
import { DropdownMenu } from '@/shared/components/ui';
import { useRole } from '@/shared/hooks';
import { cn } from '@/shared/lib';
import { Check, Eye, Link, UserRound, X } from 'lucide-react';

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
  const isTeacher = role === 'ROLE_TEACHER';

  const teacherData = teacherQuery.data;
  const studentData = studentQuery.data;
  const data = isTeacher ? teacherData : studentData;
  const homework = data?.homework;
  const isPending = isTeacher ? teacherQuery.isPending : studentQuery.isPending;
  const isError = isTeacher ? teacherQuery.isError : studentQuery.isError;

  const teachingNotes = homework?.teachingNoteInfoList ?? [];
  const homeworkStudents = teacherData?.homeworkStudents ?? [];
  const assignmentTargets = isTeacher
    ? homeworkStudents.map((student) => ({
        id: student.studentId,
        name: student.studentName,
        readAt: student.readAt,
      }))
    : studentData
      ? [
          {
            id: studentData.myHomeworkStudent.id,
            name: studentData.myHomeworkStudent.studentName,
            readAt: studentData.myHomeworkStudent.readAt,
          },
          ...studentData.otherHomeworkStudents.map((student, index) => ({
            id: index,
            name: student.studentName,
            readAt: student.readAt,
          })),
        ]
      : [];

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
    if (!homework?.deadline) return false;

    const today = new Date();
    const deadlineDate = new Date(homework.deadline);

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
  if (isError || !homework) return <div>데이터를 불러오지 못했습니다.</div>;

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
            {isTeacher && (
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
              {deadLineTime(homework.deadline)}
            </span>
          </div>
          <h3 className="font-headline1-heading">{homework.title}</h3>

          <hr className="text-gray-scale-gray-10" />

          {/* 연결 수업노트 */}
          <div className="font-label-normal flex cursor-default flex-col gap-2">
            <div className="bg-gray-scale-gray-1 text-gray-scale-gray-70 flex w-fit items-center gap-1 rounded-sm px-2 py-1">
              <Link size={14} />
              <span>연결 수업노트</span>
            </div>
            <div>
              {teachingNotes.length === 0 ? (
                <div>없음</div>
              ) : (
                teachingNotes.map((note) => (
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

          {/* 과제 인원 및 제출여부 */}
          <div className="font-label-normal flex cursor-default flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <div className="bg-background-gray text-text-sub2 font-label-normal flex w-fit items-center gap-2 rounded-lg px-3 py-2">
                <UserRound size={14} />
                <span>과제대상</span>
              </div>
              <div className="bg-background-gray text-text-sub2 font-label-normal flex w-fit items-center gap-2 rounded-lg px-3 py-2">
                <Eye size={14} />
                <span>읽음</span>
              </div>
            </div>
            <div>
              {assignmentTargets.length === 0 ? (
                <div>없음</div>
              ) : (
                <ul className="text-text-main font-body2-normal m-0 list-none space-y-1 p-0">
                  {assignmentTargets.map((student) => (
                    <li
                      key={student.id}
                      className="flex justify-between"
                    >
                      <span className="justify-self-center text-center">
                        {student.name}
                      </span>
                      {student.readAt ? (
                        <Check
                          className="justify-self-center"
                          color="#34C759"
                          size={14}
                        />
                      ) : (
                        <X
                          className="justify-self-center"
                          color="#c73342"
                          size={14}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </ColumnLayout.Left>
    </>
  );
};
