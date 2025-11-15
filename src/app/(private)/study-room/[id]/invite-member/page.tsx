'use client';

import React from 'react';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import { useSendInvitation } from '@/features/study-rooms';
import { InvitationField } from '@/features/study-rooms/components/student-invitation/InvitationField';
import { useInvitationController } from '@/features/study-rooms/hooks/useInvitationController';
import { ColumnLayout } from '@/layout/column-layout';
import { Button } from '@/shared/components/ui/button';

const InviteMemberPage = () => {
  const router = useRouter();
  const params = useParams();
  const studyRoomId = Number(params.id);

  const invitation = useInvitationController(studyRoomId);
  const { mutate: sendInvitation, isPending } = useSendInvitation();

  const handleSubmit = () => {
    const emails = Array.from(invitation.invitees.keys());
    if (!emails.length) return;
    sendInvitation(
      { studyRoomId, emails },
      {
        onSuccess: () =>
          router.replace(`/studyrooms/${studyRoomId}/studynotes`),
      }
    );
  };

  return (
    <div className="desktop:pl-sidebar-width flex flex-col bg-[#F9F9F9]">
      {/*<Sidebar />*/}
      <ColumnLayout className="h-[calc(100vh-theme(space.header-height))] container mx-auto flex flex-col items-center overflow-auto pt-0">
        <section className="w-3/4">
          <h3
            id="invite-label"
            className="mb-4 text-2xl font-semibold"
          >
            초대할 학생이 있나요?
          </h3>
          <InvitationField
            labelledById="invite-label"
            invitation={invitation}
            placeholder="초대할 학생을 검색후 선택해 주세요."
          />
          <aside
            role="note"
            aria-labelledby="invitation-info-title"
            className="mt-6 flex items-start gap-2"
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
          <div className="mt-10 flex items-center justify-between space-y-4">
            <p className="text-muted-foreground bg-key-color-secondary mb-0 rounded-md p-2 text-sm">
              학생을 초대하지 않아도 스터디룸 기능을 먼저 사용할 수 있어요
            </p>
            <Button
              type="button"
              className="w-[140px]"
              disabled={!invitation.invitees.size || isPending}
              onClick={handleSubmit}
            >
              {isPending ? '초대 중…' : '초대하기'}
            </Button>
          </div>
        </section>
      </ColumnLayout>
    </div>
  );
};

export default InviteMemberPage;
