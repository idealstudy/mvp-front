'use client';

import React from 'react';

import Image from 'next/image';

import { useUpdateTeacherOnboarding } from '@/features/dashboard/hooks/use-update-onboarding';
import { useSendInvitation } from '@/features/study-rooms';
import { InvitationField } from '@/features/study-rooms/components/student-invitation/InvitationField';
import { useInvitationController } from '@/features/study-rooms/hooks/useInvitationController';
import { Button } from '@/shared/components/ui/button';
import { Dialog } from '@/shared/components/ui/dialog';
import {
  trackStudentInviteClick,
  trackStudentInviteSuccess,
} from '@/shared/lib/analytics';
import { useMemberStore } from '@/store';

export const InvitationDialog = ({
  isOpen,
  placeholder,
  onOpenChange,
  title,
  error,
  studyRoomId,
}: {
  isOpen: boolean;
  placeholder: string;
  onOpenChange: () => void;
  title: string;
  error?: string;
  studyRoomId: number;
}) => {
  const invitation = useInvitationController(studyRoomId);
  const { mutate: sendInvitation, isPending } = useSendInvitation();
  const session = useMemberStore((s) => s.member);
  const { sendOnboarding } = useUpdateTeacherOnboarding('INVITE_STUDENT');

  const handleSubmit = () => {
    const emails = Array.from(invitation.invitees.keys());
    if (!emails.length) return;

    // 학생 초대 클릭 이벤트
    // TODO: to_user_id는 실제 초대된 사용자 ID로 변경 필요
    const toUserId = ''; // 초대된 학생의 ID (API 응답에서 받아와야 함)
    trackStudentInviteClick(
      {
        room_id: studyRoomId,
        from_user_id: session?.id ?? 0,
        to_user_id: toUserId, // TODO: 실제 초대된 사용자 ID로 변경 필요 (현재 API 응답에 userId 없음)
      },
      session?.role ?? null
    );

    sendInvitation(
      { studyRoomId, emails },
      {
        onSuccess: (data) => {
          // 학생 초대 성공 이벤트
          // TODO: data에서 실제 초대된 사용자 ID 추출 (현재는 email만 있음)
          const successEmails = data?.successEmailList || [];
          successEmails.forEach((success) => {
            trackStudentInviteSuccess(
              {
                room_id: studyRoomId,
                from_user_id: session?.id ?? 0,
                to_user_id: success.name, // TODO: 실제 초대된 사용자 ID로 변경 필요 (현재 API 응답에 userId 없음)
              },
              session?.role ?? null
            );
          });
          // 온보딩 반영
          sendOnboarding();
          onOpenChange();
        },
      }
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content className="w-[798px]">
        <Dialog.Header>
          <Dialog.Title className="text-3xl">{title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="mt-6">
          <Dialog.Description className="sr-only">
            초대할 사용자를 검색하고 초대할 수 있는 다이얼로그입니다.
          </Dialog.Description>
          <InvitationField
            invitation={invitation}
            placeholder={placeholder}
          />
          <aside
            role="note"
            aria-labelledby="invitation-info-title"
            className="flex items-start gap-2"
          >
            <Image
              src="/common/info.svg"
              alt="alert"
              width={20}
              height={20}
              className="relative top-[3px]"
            />
            <h2
              id="invitation-info-title"
              className="sr-only"
            >
              사용자(학생)초대 관련 안내
            </h2>
            <ul className="space-y-1">
              <li>학생을 초대하면 연결된 보호자는 자동으로 함께 입장합니다.</li>
              <li>
                각 수업 노트는 보호자에게 공개하거나 비공개로 설정할 수
                있습니다.
              </li>
              <li>
                학생과 연결되지 않은 보호자는 스터디룸에 입장할 수 없습니다.
              </li>
            </ul>
          </aside>
        </Dialog.Body>
        <Dialog.Footer className="mt-6 justify-end">
          <Button
            className="w-[140px]"
            type="button"
            disabled={!invitation.invitees.size || !!error || isPending}
            onClick={handleSubmit}
          >
            {isPending ? '초대 중…' : '초대하기'}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
