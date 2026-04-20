'use client';

import { useEffect, useMemo, useState } from 'react';

import { usePublicStudyRoomsQuery } from '@/features/list';

import {
  useParentDashboardConnectedStudentQuery,
  useParentDashboardInquiryListQuery,
  useParentDashboardStudyConsultationQuery,
  useParentDashboardStudyNewsQuery,
} from '../../hooks/use-dashboard-query';
import DashboardHeader from '../header';
import { ClassConsultationHistorySection } from '../section/parent-class-consultation-history-section';
import { ConsultationSection } from '../section/parent-consultation-section';
import { ParentLinkSection } from '../section/parent-link-section';
import { StudyNewsSection } from '../section/parent-study-news-section';
import { StudyRoomPreviewSection } from '../section/parent-studyroom-preview-section';

const DashboardParent = () => {
  const { data: connectedStudentData } =
    useParentDashboardConnectedStudentQuery();

  // 첫번째 학생의 id
  const firstStudentId = connectedStudentData?.[0]?.studentId;

  // 드롭다운에서 선택된 학생, 스터디룸 id
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [selectedStudyRoomId, setSelectedStudyRoomId] = useState<number | null>(
    null
  );

  // 드롭다운에서 선택된 학생, 스터디룸
  const selectedStudent = connectedStudentData?.find(
    (student) => student.studentId === selectedStudentId
  );
  const selectedStudentName = selectedStudent?.studentName ?? '-';
  const selectedStudyRooms = useMemo(() => {
    return selectedStudent?.studyRooms ?? [];
  }, [selectedStudent]);
  // 학생의 스터디룸의 첫번째 스터디룸 id
  const firstSelectedStudyRoomId = useMemo(() => {
    return selectedStudyRooms[0]?.studyRoomId ?? null;
  }, [selectedStudyRooms]);

  // 첫번째 학생의 id 가 undefined, 선택된 학생의 id가 null이면 선택된 학생의 id는 첫번째 학생으로 고정
  useEffect(() => {
    if (firstStudentId !== undefined && selectedStudentId === null) {
      setSelectedStudentId(firstStudentId);
    }
  }, [firstStudentId, selectedStudentId]);

  useEffect(() => {
    if (selectedStudentId === null) return;

    const hasSelectedStudyRoom = selectedStudyRooms.some(
      (room) => room.studyRoomId === selectedStudyRoomId
    );

    if (!hasSelectedStudyRoom) {
      setSelectedStudyRoomId(firstSelectedStudyRoomId);
    }
  }, [
    selectedStudentId,
    selectedStudyRoomId,
    selectedStudyRooms,
    firstSelectedStudyRoomId,
  ]);

  // 기본 초기값
  const basicData = {
    pageNumber: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    content: [],
  };

  // 학습 소식
  const { data: studyNewsData, isPending: studyNewsPending } =
    useParentDashboardStudyNewsQuery(selectedStudentId, undefined, {
      enabled: selectedStudentId !== null,
    });
  // 학습 일지
  const { data: studyConsultationData, isPending: studyConsultationIsPending } =
    useParentDashboardStudyConsultationQuery(
      selectedStudentId,
      selectedStudyRoomId,
      undefined,
      {
        enabled: selectedStudentId !== null && selectedStudyRoomId !== null,
      }
    );
  // TODO: 스터디룸 둘러보기 - 임시로 /public/study-rooms 갖다쓰기
  // const { data: studyRoomPreviewData, isPending: studyRoomPreviewIsPending } =
  //   useParentDashboardStudyRoomPreviewQuery();

  const { data: studyRoomPreviewData, isPending: studyRoomPreviewIsPending } =
    usePublicStudyRoomsQuery({
      page: 0,
      size: 4,
    });

  // 문의 목록 조회
  const { data: inquiryListData, isPending: inquiryListIsPending } =
    useParentDashboardInquiryListQuery();

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader />
      <main className="tablet:gap-12 desktop:gap-20 bg-gray-white tablet:py-12 desktop:pb-25 tablet:px-20 relative flex w-full flex-col gap-8 px-4.5 py-8">
        <ParentLinkSection />
        <div className="tablet:gap-25 flex w-full flex-col gap-8">
          <StudyNewsSection
            connectedStudentData={connectedStudentData ?? []}
            studyNewsData={studyNewsData ?? basicData}
            studyNewsPending={studyNewsPending}
            selectedStudentId={selectedStudentId}
            setSelectedStudentId={setSelectedStudentId}
          />

          <ConsultationSection
            connectedStudentData={connectedStudentData ?? []}
            studyConsultationData={studyConsultationData ?? basicData}
            studyConsultationIsPending={studyConsultationIsPending}
            selectedStudentId={selectedStudentId}
            selectedStudyRoomId={selectedStudyRoomId}
            setSelectedStudyRoomId={setSelectedStudyRoomId}
            selectedStudentName={selectedStudentName}
          />
          <StudyRoomPreviewSection
            studyRoomPreviewData={studyRoomPreviewData?.content ?? []}
            studyRoomPreviewIsPending={studyRoomPreviewIsPending}
          />
          <ClassConsultationHistorySection
            inquiryListData={inquiryListData ?? basicData}
            inquiryListIsPending={inquiryListIsPending}
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardParent;
