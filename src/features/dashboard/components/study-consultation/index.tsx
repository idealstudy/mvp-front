'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  ParentDashboardConnectedStudentListDTO,
  ParentDashboardConsultationListDTO,
} from '@/entities/parent';

import {
  useParentDashboardConnectedStudentQuery,
  useParentDashboardStudyConsultationQuery,
} from '../../hooks/use-dashboard-query';
import { MoreContentsHeader } from '../more-contents-header';
import { ConsultationList } from './study-consultation-list';

export const StudyConsultation = ({
  initialStudentId,
  initialStudyRoomId,
}: {
  initialStudentId?: string;
  initialStudyRoomId?: string;
}) => {
  const [page, setPage] = useState(1);

  const { data: connectedStudentData } =
    useParentDashboardConnectedStudentQuery();

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

  // initialStudentId가 없으면 첫번째 학생으로 고정
  useEffect(() => {
    if (!connectedStudentData?.length || selectedStudentId !== null) return;

    const parsedStudentId =
      initialStudentId !== undefined ? Number(initialStudentId) : null;

    const hasInitialStudent =
      parsedStudentId !== null &&
      !Number.isNaN(parsedStudentId) &&
      connectedStudentData.some(
        (student) => student.studentId === parsedStudentId
      );

    if (hasInitialStudent) {
      setSelectedStudentId(parsedStudentId);
      return;
    }
    const firstStudentId = connectedStudentData?.[0]?.studentId ?? null;
    setSelectedStudentId(firstStudentId);
  }, [connectedStudentData, initialStudentId, selectedStudentId]);

  // 선택된 roomId 검증
  useEffect(() => {
    if (selectedStudentId === null) return;

    const parsedStudyRoomId =
      initialStudyRoomId !== undefined ? Number(initialStudyRoomId) : null;

    const hasInitialStudyRoom =
      parsedStudyRoomId !== null &&
      !Number.isNaN(parsedStudyRoomId) &&
      selectedStudyRooms.some((room) => room.studyRoomId === parsedStudyRoomId);

    if (hasInitialStudyRoom && selectedStudyRoomId === null) {
      setSelectedStudyRoomId(parsedStudyRoomId);
      return;
    }
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
    initialStudyRoomId,
  ]);

  useEffect(() => {
    setPage(1);
  }, [selectedStudentId]);

  const { data: studyConsultationData, isPending: studyConsultationIsPending } =
    useParentDashboardStudyConsultationQuery(
      selectedStudentId,
      selectedStudyRoomId,
      {
        page: page - 1,
        size: 10,
      },
      {
        enabled: !!selectedStudentId && !!selectedStudyRoomId,
      }
    );

  const basicData: ParentDashboardConsultationListDTO = {
    pageNumber: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    content: [],
  };

  return (
    <div className="flex min-h-[calc(100vh-76px)] w-full flex-col">
      <MoreContentsHeader
        kind="STUDY_CONSULTATION"
        selectedStudentName={selectedStudentName}
      />
      <ConsultationList
        connectedStudentData={
          connectedStudentData ?? ([] as ParentDashboardConnectedStudentListDTO)
        }
        studyConsultationData={studyConsultationData ?? basicData}
        studyConsultationIsPending={studyConsultationIsPending}
        selectedStudentId={selectedStudentId}
        selectedStudyRoomId={selectedStudyRoomId}
        setSelectedStudyRoomId={setSelectedStudyRoomId}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
};
