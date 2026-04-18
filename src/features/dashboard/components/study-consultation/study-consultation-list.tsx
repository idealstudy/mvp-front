'use client';

import { useState } from 'react';

import {
  ParentDashboardConnectedStudentListDTO,
  ParentDashboardConsultationItemDTO,
  ParentDashboardConsultationListDTO,
} from '@/entities/parent';
import { Skeleton } from '@/shared/components/loading';
import { Pagination } from '@/shared/components/ui';
import { cn } from '@/shared/lib';

import { ConsultationItem } from '../section-content/parent-consultation-item';
import { ConsultationItemDetail } from '../section-content/parent-consultation-item-detail';
import { StudyRoomDropdown } from '../section/tabbed-section';

interface ConsultationListProps {
  connectedStudentData: ParentDashboardConnectedStudentListDTO;
  studyConsultationData: ParentDashboardConsultationListDTO;
  studyConsultationIsPending: boolean;
  selectedStudyRoomId: number | null;
  setSelectedStudyRoomId: (id: number | null) => void;
  selectedStudentId: number | null;
  page: number;
  onPageChange: (page: number) => void;
}

export const ConsultationList = ({
  connectedStudentData,
  studyConsultationData,
  studyConsultationIsPending,
  selectedStudyRoomId,
  setSelectedStudyRoomId,
  selectedStudentId,
  page,
  onPageChange,
}: ConsultationListProps) => {
  const [selectedConsultationItem, setSelectedConsultationItem] =
    useState<ParentDashboardConsultationItemDTO | null>(null);

  // 선택된 학생을 찾는다.
  const selectedStudent = connectedStudentData.find(
    (student) => student.studentId === selectedStudentId
  );

  const studyRoomOptions =
    selectedStudent?.studyRooms.map((room) => ({
      id: room.studyRoomId,
      name: room.studyRoomName,
    })) ?? [];

  const selectedStudyRoom = studyRoomOptions.find(
    (studyRoom) => studyRoom.id === selectedStudyRoomId
  );

  const studyConsultationDataLength = studyConsultationData.content.length;

  return (
    <>
      <div
        className={cn(
          'bg-gray-white flex flex-1 flex-col items-center gap-3 px-4.5 pt-8 pb-3',
          'tablet:pt-12 tablet:pb-9 tablet:px-36'
        )}
      >
        <div className="flex w-full flex-col gap-8">
          <div className="flex items-center gap-2">
            {studyConsultationData.totalElements > 1 ? (
              <StudyRoomDropdown
                studyRooms={studyRoomOptions}
                selectedId={selectedStudyRoomId}
                onSelect={setSelectedStudyRoomId}
              />
            ) : null}

            <div className="font-body1-heading text-gray-12">
              {studyConsultationDataLength > 1 ? (
                <div className="flex items-center gap-2">
                  기록일지
                  <span className="font-headline1-normal text-orange-7">
                    {studyConsultationDataLength}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {selectedStudyRoom?.name ?? '기록일지'} 스터디룸 기록일지
                  <span className="text-orange-7 font-headline1-normal">
                    {studyConsultationDataLength}
                  </span>
                </div>
              )}
            </div>
          </div>
          {studyConsultationIsPending ? (
            <div className="flex w-full flex-col gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton.Block
                  key={i}
                  className="h-12"
                />
              ))}
            </div>
          ) : studyConsultationDataLength === 0 ? (
            <div className="flex h-22 w-full items-center justify-center">
              <p className="font-body2-normal text-gray-8">
                스터디룸 기록일지가 없어요.
              </p>
            </div>
          ) : (
            <>
              {studyConsultationData.content.map((item) => (
                <ConsultationItem
                  item={item}
                  key={item.id}
                  onSelectItem={(item) => setSelectedConsultationItem(item)}
                />
              ))}
            </>
          )}
        </div>
        {studyConsultationData.totalPages && (
          <Pagination
            page={page}
            onPageChange={onPageChange}
            totalPages={studyConsultationData.totalPages}
          />
        )}
      </div>
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
