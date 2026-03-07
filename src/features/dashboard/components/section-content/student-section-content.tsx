'use client';

import Image from 'next/image';
import Link from 'next/link';

import { TeacherDashboardMemberListItemDTO } from '@/entities/teacher';
import { Pagination } from '@/shared/components/ui';
import { PRIVATE } from '@/shared/constants';
import { cn } from '@/shared/lib';

export interface StudentsSectionContentProps {
  students: TeacherDashboardMemberListItemDTO[];
  studyRoomId?: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ROLE_LABEL: Record<string, string> = {
  ROLE_STUDENT: '학생',
  ROLE_TEACHER: '선생님',
  ROLE_PARENT: '보호자',
  ROLE_ADMIN: '관리자',
  ROLE_MEMBER: '멤버',
};

const STATE_LABEL: Record<
  NonNullable<StudentsSectionContentProps['students'][number]['state']>,
  string
> = {
  PENDING: '대기 중',
  APPROVED: '참여 중',
  REJECTED: '거절됨',
  TERMINATED: '탈퇴',
};

const getDaysSince = (dateStr: string): number => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 0;
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

const StudentsSectionContent = ({
  students,
  studyRoomId,
  page,
  totalPages,
  onPageChange,
}: StudentsSectionContentProps) => {
  if (students.length === 0) {
    return (
      <div className="flex h-22 w-full flex-col justify-center gap-3">
        <p className="font-body2-normal text-gray-8">
          스터디룸의 초대 링크로 학생을 초대해주세요.
        </p>
        {studyRoomId && (
          <Link
            href={PRIVATE.ROOM.DETAIL(studyRoomId!)}
            className="font-body2-normal tablet:font-headline2-normal bg-gray-white border-gray-5 desktop:py-5 text-gray-12 hover:bg-gray-1 flex w-full items-center justify-center rounded-[8px] border-1 py-4"
          >
            학생 초대하러 가기
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="bg-gray-white flex w-full flex-col">
        {students.map((student) => {
          const daysLabel = `D+${getDaysSince(student.joinDate)}`;
          const joinDate = student.joinDate
            ?.split('T')[0]
            ?.replaceAll('-', '.');

          return (
            <div
              key={student.id}
              className="flex w-full items-center gap-3 px-3 py-3"
            >
              {/* 아바타 */}
              <div className="border-gray-12 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border">
                <Image
                  src={'/character/img_profile_student01.png'}
                  alt={`${student.name} 프로필`}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full"
                />
              </div>

              {/* 이름 + 역할 / D+N · 가입일 | 이메일 · 상태 */}
              <div className="min-w-0 flex-1">
                <p className="font-body2-heading text-gray-black flex items-center gap-1.5">
                  {student.name}
                  {student.role && (
                    <>
                      <span className="text-gray-4">·</span>
                      <span className="font-body2-normal text-gray-7">
                        {ROLE_LABEL[student.role] ?? student.role}
                      </span>
                    </>
                  )}
                </p>
                <div className="font-caption-normal flex flex-wrap items-center gap-1.5">
                  <span className="text-orange-6 font-caption-heading">
                    {daysLabel}
                  </span>
                  <span className="text-gray-7">{joinDate} 가입</span>
                  <span className="text-gray-4">|</span>
                  <span className="text-gray-7 min-w-0 truncate">
                    {student.email}
                  </span>
                  {student.state && (
                    <span
                      className={cn(
                        'font-caption-heading shrink-0 rounded-md px-2 py-1',
                        student.state === 'APPROVED'
                          ? 'bg-orange-2 text-orange-7'
                          : 'bg-gray-2 text-gray-7'
                      )}
                    >
                      {STATE_LABEL[student.state]}
                    </span>
                  )}
                </div>
              </div>

              {/* 더보기 */}
              {/* <DropdownMenu>
                <DropdownMenu.Trigger className="text-gray-5 hover:bg-gray-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                  <EllipsisVertical className="h-5 w-5" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item asChild>
                    <Link href={PUBLIC.PROFILE.DETAIL(student.id)}>
                      프로필 보기
                    </Link>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu> */}
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default StudentsSectionContent;
