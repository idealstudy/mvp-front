'use client';

import { useState } from 'react';

import {
  ParentDashboardConnectedStudentListDTO,
  ParentDashboardConsultationItemDTO,
  ParentDashboardConsultationListDTO,
} from '@/entities/parent';
import { Skeleton } from '@/shared/components/loading';

import { ConsultationItem } from '../section-content/parent-consultation-item';
import { ConsultationItemDetail } from '../section-content/parent-consultation-item-detail';
import DashboardSection from './single-section';
import { StudyRoomDropdown } from './tabbed-section';

interface ConsultationSectionProps {
  connectedStudentData: ParentDashboardConnectedStudentListDTO;
  studyConsultationData: ParentDashboardConsultationListDTO;
  studyConsultationIsPending: boolean;
  selectedStudentId: number | null;
  selectedStudyRoomId: number | null;
  setSelectedStudyRoomId: (id: number | null) => void;
  selectedStudentName: string;
}

export const ConsultationSection = ({
  connectedStudentData,
  studyConsultationData,
  studyConsultationIsPending,
  selectedStudentId,
  selectedStudyRoomId,
  setSelectedStudyRoomId,
  selectedStudentName,
}: ConsultationSectionProps) => {
  const [selectedConsultationItem, setSelectedConsultationItem] =
    useState<ParentDashboardConsultationItemDTO | null>(null);

  const limitConsultation = studyConsultationData.content.slice(0, 3);
  const studyConsultationDataLength = studyConsultationData.totalElements;

  const selectedStudent = connectedStudentData.find(
    (student) => student.studentId === selectedStudentId
  );

  const studyRoomOptions =
    selectedStudent?.studyRooms.map((room) => ({
      id: room.studyRoomId,
      name: room.studyRoomName,
    })) ?? [];

  const headerAction =
    studyRoomOptions.length === 0 ? null : (
      <StudyRoomDropdown
        studyRooms={studyRoomOptions}
        selectedId={selectedStudyRoomId}
        onSelect={setSelectedStudyRoomId}
        parent
      />
    );

  let content;

  if (studyConsultationIsPending) {
    content = (
      <div className="flex w-full flex-col gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton.Block
            key={i}
            className="h-12"
          />
        ))}
      </div>
    );
  } else if (studyConsultationDataLength === 0) {
    content = (
      <div className="flex h-22 w-full flex-col items-center justify-center gap-3">
        <p className="font-body2-normal text-gray-8">기록일지가 없어요.</p>
      </div>
    );
  } else {
    content = (
      <div className="flex w-full flex-col">
        {limitConsultation.map((data, i) => (
          <ConsultationItem
            key={data.id}
            item={data}
            onSelectItem={(item) => setSelectedConsultationItem(item)}
            isLast={i === limitConsultation.length - 1}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <section>
        <DashboardSection
          studentName={selectedStudentName}
          title="스터디룸 기록일지"
          headerAction={headerAction}
          description="선생님이 직접 작성한 기록일지예요."
          count={studyConsultationDataLength}
          isMoreHref={
            selectedStudentId !== null && selectedStudyRoomId !== null
              ? `/dashboard/study-consultation?studentId=${selectedStudentId}&studyRoomId=${selectedStudyRoomId}`
              : '/dashboard/study-consultation'
          }
          isMore={studyConsultationDataLength === 0 ? false : true}
          isMoreDescription="전체보기"
        >
          {content}
        </DashboardSection>
      </section>

      <ConsultationItemDetail
        open={selectedConsultationItem !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedConsultationItem(null);
        }}
        regDate={selectedConsultationItem?.regDate}
        content={selectedConsultationItem?.contentPreview}
      />
    </>
  );
};
