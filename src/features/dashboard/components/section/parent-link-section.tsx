'use client';

import { useState } from 'react';

import Image from 'next/image';

import { ParentDashboardConnectedStudentListDTO } from '@/entities/parent';
import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/lib';

import { useSentConnectionList } from '../../connect/hooks/use-connection';
import { ConnectDialog } from '../section-content/parent-connect-dialog';

export const ParentLinkSection = ({
  connectedStudents,
}: {
  connectedStudents: ParentDashboardConnectedStudentListDTO;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: sentConnectionData } = useSentConnectionList({
    page: 0,
    size: 10,
    sort: 'regDate,DESC',
  });

  const pendingConnection = sentConnectionData?.connectionList.find(
    (connection) => connection.state === 'PENDING' && connection.recipientEmail
  );
  const pendingStudentEmail = pendingConnection?.recipientEmail;
  const pendingStudentEmails =
    sentConnectionData?.connectionList
      .filter(
        (connection) =>
          connection.state === 'PENDING' && connection.recipientEmail
      )
      .map((connection) => connection.recipientEmail) ?? [];

  const hasPendingConnections = pendingStudentEmails.length > 0;

  return (
    <div className={cn('bg-orange-scale-orange-1 rounded-lg p-4')}>
      <section>
        <div className="flex w-full items-center justify-between gap-2 text-left">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/dashboard/parent-onboarding-link.png"
              alt="연결"
              height={36}
              width={36}
              unoptimized
            />
            <div className="flex flex-col">
              <p className="font-body2-heading text-gray-12">
                {hasPendingConnections
                  ? `${pendingStudentEmails.join(', ')} 학생과 연결중...`
                  : '학생을 연결해볼까요?'}
              </p>
              <p className="font-label-normal text-gray-11">
                {pendingStudentEmail
                  ? `자녀가 보호자 연결을 승인할 수 있게 도와주세요`
                  : '자녀의 학습 현황과 선생님 피드백을 실시간으로 확인할 수 있어요'}
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
            }}
            className="font-label-heading h-[35px] w-[121px]"
          >
            {hasPendingConnections ? '학생 추가하기' : '학생 연결하기'}
          </Button>
        </div>
      </section>
      {isDialogOpen && (
        <ConnectDialog
          connectedStudents={connectedStudents}
          pendingStudentEmails={pendingStudentEmails}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  );
};
