'use client';

import { useEffect, useState } from 'react';

import type {
  ParentDashboardConnectedStudentListDTO,
  ParentDashboardStudyNewsListDTO,
} from '@/entities/parent';
import {
  useParentDashboardConnectedStudentQuery,
  useParentDashboardStudyNewsQuery,
} from '@/features/dashboard/hooks/use-dashboard-query';

import { MoreContentsHeader } from '../more-contents-header';
import { StudyNewsList } from './study-news-list';

const basicData: ParentDashboardStudyNewsListDTO = {
  pageNumber: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  content: [],
};

export const StudyNews = ({
  initialStudentId,
}: {
  initialStudentId?: string;
}) => {
  const [page, setPage] = useState(1);
  const { data: connectedStudentData } =
    useParentDashboardConnectedStudentQuery();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const selectedStudent = connectedStudentData?.find(
    (student) => student.studentId === selectedStudentId
  );

  const selectedStudentName = selectedStudent?.studentName;

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

  useEffect(() => {
    setPage(1);
  }, [selectedStudentId]);

  const { data: studyNewsData, isPending: studyNewsPending } =
    useParentDashboardStudyNewsQuery(
      selectedStudentId,
      {
        page: page - 1,
        size: 10,
      },
      {
        enabled: selectedStudentId !== null,
      }
    );

  return (
    <div className="flex min-h-[calc(100vh-76px)] w-full flex-col">
      <MoreContentsHeader
        kind="STUDY_NEWS"
        selectedStudentName={selectedStudentName}
      />
      <StudyNewsList
        connectedStudentData={
          connectedStudentData ?? ([] as ParentDashboardConnectedStudentListDTO)
        }
        studyNewsData={studyNewsData ?? basicData}
        studyNewsPending={studyNewsPending}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
};
