'use client';

import { useParentHomeworkDetail } from '@/features/homework/hooks/parent/useStudentHomeworkQuries';
import { ColumnLayout } from '@/layout/column-layout';
import { DialogAction, DialogState } from '@/shared/components/dialog';
import { MiniSpinner } from '@/shared/components/loading';

import { FeedbackAnswer } from '../write/components/homework-feedback-answer';
import { HomeworkDetailLeft } from './homework-detail-left';
import { StudentHomeworkContent } from './student-homework-content';
import { StudentSubmissionContent } from './student-submission-content';

type Props = {
  studentId: number;
  studyRoomId: number;
  homeworkId: number;
  dialog: DialogState;
  dispatch: (action: DialogAction) => void;
};

export const ParentHomeworkDetail = ({
  studentId,
  studyRoomId,
  homeworkId,
  dialog,
  dispatch,
}: Props) => {
  const { data, isPending, isError } = useParentHomeworkDetail(
    studentId,
    studyRoomId,
    homeworkId
  );

  if (isPending) return <MiniSpinner />;
  if (isError || !data) return <div>데이터를 불러오지 못했습니다.</div>;

  const { homework, myHomeworkStudent } = data;

  return (
    <>
      <HomeworkDetailLeft
        studentId={studentId}
        studyRoomId={studyRoomId}
        homeworkId={homeworkId}
        dialog={dialog}
        dispatch={dispatch}
      />

      <ColumnLayout.Right className="desktop:min-w-[740px] flex w-full flex-col gap-3 rounded-[12px]">
        <StudentHomeworkContent
          content={homework.resolvedContent?.content ?? homework.content ?? '-'}
          authorName={homework.teacherName ?? '-'}
          regDate={homework.modifiedAt ?? '-'}
        />

        {myHomeworkStudent.submission ? (
          <div className="my-6 space-y-3">
            <StudentSubmissionContent
              homeworkStudentId={myHomeworkStudent.id}
              content={
                myHomeworkStudent.submission.resolvedContent?.content ??
                myHomeworkStudent.submission.content ??
                '-'
              }
              rawContent={myHomeworkStudent.submission.content ?? '-'}
              authorName={myHomeworkStudent.studentName}
              regDate={myHomeworkStudent.submission.modifiedSubmissionAt ?? '-'}
              submitStatus={myHomeworkStudent.status}
              studyRoomId={studyRoomId}
              homeworkId={homeworkId}
              dialog={dialog}
              dispatch={dispatch}
              readOnly
            />

            {myHomeworkStudent.feedback && (
              <FeedbackAnswer
                content={
                  myHomeworkStudent.feedback.resolvedContent?.content ??
                  myHomeworkStudent.feedback.content ??
                  ''
                }
                rawContent={myHomeworkStudent.feedback.content ?? ''}
                regDate={myHomeworkStudent.feedback.modifiedFeedbackAt ?? ''}
                studyRoomId={studyRoomId}
                homeworkId={homeworkId}
                homeworkStudentId={myHomeworkStudent.id}
                dialog={dialog}
                dispatch={dispatch}
              />
            )}
          </div>
        ) : (
          <div className="border-line-line1 rounded-xl border bg-white p-10">
            <p className="font-body2-normal text-gray-scale-gray-60">
              아직 제출한 과제가 없습니다.
            </p>
          </div>
        )}
      </ColumnLayout.Right>
    </>
  );
};
