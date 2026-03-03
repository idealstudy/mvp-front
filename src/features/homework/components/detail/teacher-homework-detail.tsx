'use client';

import { useGetTeacherHomeworkDetail } from '@/features/homework/hooks/teacher/useTeacherHomeworkQuries';
import { ColumnLayout } from '@/layout/column-layout';
import { DialogAction, DialogState } from '@/shared/components/dialog';
import { MiniSpinner } from '@/shared/components/loading';

import { FeedbackAnswer } from '../write/components/homework-feedback-answer';
import { HomeworkDetailLeft } from './homework-detail-left';
import { TeacherHomeworkContent } from './teacher-homework-content';
import { TeacherHomeworkSubmissionContent } from './teacher-submission-content';

type Props = {
  studyRoomId: number;
  homeworkId: number;
  dialog: DialogState;
  dispatch: (action: DialogAction) => void;
};

export const TeacherHomeworkDetail = ({
  studyRoomId,
  homeworkId,
  dialog,
  dispatch,
}: Props) => {
  const { data, isPending } = useGetTeacherHomeworkDetail(
    studyRoomId,
    homeworkId
  );

  if (isPending) return <MiniSpinner />;
  if (!data) return <div>데이터가 없습니다.</div>;

  return (
    <>
      <HomeworkDetailLeft
        studyRoomId={studyRoomId}
        homeworkId={homeworkId}
        dialog={dialog}
        dispatch={dispatch}
      />

      <ColumnLayout.Right className="desktop:max-w-[740px] flex w-full flex-col gap-3 rounded-[12px]">
        {/* 선생님이 낸 과제 */}
        <TeacherHomeworkContent
          content={
            data.homework.resolvedContent?.content ??
            data.homework.content ??
            ''
          }
          authorName={data.homework.teacherName ?? '-'}
          regDate={data.homework.modifiedAt ?? '-'}
        />

        {/* 학생이 남긴 과제와 선생님의 피드백 */}
        {data.homeworkStudents.map((student) => {
          if (!student.submission) return null;

          return (
            <div
              key={student.id}
              className="my-6 flex flex-col gap-3"
            >
              {/* 학생 제출 */}
              <TeacherHomeworkSubmissionContent
                homeworkStudentId={student.id}
                content={
                  student.submission.resolvedContent?.content ??
                  student.submission.content ??
                  '-'
                }
                authorName={student.studentName ?? '-'}
                regDate={student.submission.modifiedSubmissionAt ?? '-'}
                submitStatus={student.status}
                homeworkId={homeworkId}
                studyRoomId={studyRoomId}
                hasFeedback={!!student.feedback}
              />

              {/* 해당 학생의 피드백 */}
              {student.feedback && (
                <FeedbackAnswer
                  content={
                    student.feedback.resolvedContent?.content ??
                    student.feedback.content ??
                    ''
                  }
                  rawContent={student.feedback.content ?? ''}
                  regDate={student.feedback.modifiedFeedbackAt ?? ''}
                  studyRoomId={studyRoomId}
                  homeworkId={homeworkId}
                  homeworkStudentId={student.id}
                  dialog={dialog}
                  dispatch={dispatch}
                />
              )}
            </div>
          );
        })}
      </ColumnLayout.Right>
    </>
  );
};
