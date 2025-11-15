'use client';

import React from 'react';

import { useParams, usePathname } from 'next/navigation';

import StudentQuestionSession from '@/features/qna/components/detail/student-qna-tab';
import TeacherQuestionSession from '@/features/qna/components/detail/teacher-qna-tab';
import { useRole } from '@/shared/hooks/use-role';

const StudyNoteQnAPage = () => {
  const { role } = useRole();
  const path = usePathname();
  const params = useParams();
  const studyRoomId = Number(params.id);
  const segment = path.split('/').pop();
  return (
    <>
      {segment === 'qna' && role === 'ROLE_TEACHER' && (
        <TeacherQuestionSession studyRoomId={studyRoomId} />
      )}
      {segment === 'qna' && role === 'ROLE_STUDENT' && (
        <StudentQuestionSession studyRoomId={studyRoomId} />
      )}
    </>
  );
};

export default StudyNoteQnAPage;
