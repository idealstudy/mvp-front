'use client';

import { useStudentHomeworkDetail } from '@/features/homework/hooks/student/useStudentHomeworkQuries';
import { ColumnLayout } from '@/layout/column-layout';
import { DialogAction, DialogState } from '@/shared/components/dialog';
import { MiniSpinner } from '@/shared/components/loading';

import {
  MyHomeworkStudent,
  OtherHomeworkStudent,
} from '../../model/homeworkDetail.types';
import { FeedbackAnswer } from '../write/components/homework-feedback-answer';
import { WriteFormArea } from '../write/components/homework-write-form-area';
import { StudentHomeworkFormProvider } from '../write/components/student-form-provider';
import { HomeworkDetailLeft } from './homework-detail-left';
import { StudentFeedbackBlock } from './student-feedback-block';
import { StudentHomeworkContent } from './student-homework-content';
import { StudentSubmissionContent } from './student-submission-content';

type Props = {
  studyRoomId: number;
  homeworkId: number;
  dialog: DialogState;
  dispatch: (action: DialogAction) => void;
};

type TimelineItem =
  | {
      type: 'me';
      submittedAt: string;
      data: MyHomeworkStudent;
    }
  | {
      type: 'other';
      submittedAt: string;
      data: OtherHomeworkStudent;
    };

// 학생 과제 디테일 화면
export const StudentHomeworkDetail = ({
  studyRoomId,
  homeworkId,
  dialog,
  dispatch,
}: Props) => {
  const { data, isPending } = useStudentHomeworkDetail(studyRoomId, homeworkId);

  if (isPending) return <MiniSpinner />;
  if (!data) return <div>데이터가 없습니다.</div>;

  const timelineItems: TimelineItem[] = [];

  // 내 제출
  if (data.myHomeworkStudent.submission?.modifiedSubmissionAt) {
    timelineItems.push({
      type: 'me',
      submittedAt: data.myHomeworkStudent.submission.modifiedSubmissionAt,
      data: data.myHomeworkStudent,
    });
  }

  // 다른 학생 제출
  data.otherHomeworkStudents?.forEach((student) => {
    if (student.modifiedSubmissionAt) {
      timelineItems.push({
        type: 'other',
        submittedAt: student.modifiedSubmissionAt,
        data: student,
      });
    }
  });

  // 오래된 제출 → 최신 제출
  const sortedTimeline = timelineItems.sort(
    (a, b) =>
      new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
  );

  return (
    <>
      <HomeworkDetailLeft
        studyRoomId={studyRoomId}
        homeworkId={homeworkId}
        dialog={dialog}
        dispatch={dispatch}
      />

      <ColumnLayout.Right className="desktop:min-w-[740px] flex w-full flex-col gap-3 rounded-[12px]">
        {/* 선생님이 낸 과제 */}
        {data.homework && (
          <StudentHomeworkContent
            content={
              data.homework.resolvedContent?.content ??
              data.homework.content ??
              '-'
            }
            authorName={data.homework.teacherName ?? '-'}
            regDate={data.homework.modifiedAt ?? '-'}
          />
        )}

        {/* 제출 타임라인 (내 제출 + 다른 학생 제출) */}
        {sortedTimeline.map((item) => {
          if (item.type === 'me') {
            return (
              <div
                key={`my-${item.data.id}`}
                className="my-6 space-y-3"
              >
                <StudentSubmissionContent
                  homeworkStudentId={item.data.id}
                  content={
                    item.data.submission?.resolvedContent?.content ??
                    item.data.submission?.content ??
                    '-'
                  }
                  rawContent={item.data.submission?.content ?? '-'}
                  authorName={item.data.studentName}
                  regDate={item.data.submission?.modifiedSubmissionAt ?? '-'}
                  submitStatus={item.data.status}
                  studyRoomId={studyRoomId}
                  homeworkId={homeworkId}
                  dialog={dialog}
                  dispatch={dispatch}
                />

                {item.data.feedback && (
                  <FeedbackAnswer
                    content={
                      item.data.feedback.resolvedContent?.content ??
                      item.data.feedback.content ??
                      ''
                    }
                    rawContent={item.data.feedback.content ?? ''}
                    regDate={item.data.feedback.modifiedFeedbackAt ?? ''}
                    studyRoomId={studyRoomId}
                    homeworkId={homeworkId}
                    homeworkStudentId={item.data.id}
                    dialog={dialog}
                    dispatch={dispatch}
                  />
                )}
              </div>
            );
          }

          // 다른 학생 제출
          return (
            <div
              key={`other-${item.data.studentName}-${item.submittedAt}`}
              className="my-6 space-y-3"
            >
              <StudentHomeworkContent
                content="다른 학생이 제출한 과제는 확인할 수 없습니다."
                authorName={item.data.studentName}
                regDate={item.data.modifiedSubmissionAt ?? '-'}
              />

              {item.data.modifiedFeedbackAt && (
                <StudentFeedbackBlock
                  content="다른 학생이 제출한 과제의 피드백은 확인할 수 없습니다."
                  regDate={item.data.modifiedFeedbackAt}
                />
              )}
            </div>
          );
        })}

        {/* 3. 과제 제출 폼 */}
        {data.myHomeworkStudent.status === 'NOT_SUBMIT' && (
          <StudentHomeworkFormProvider
            studyRoomId={studyRoomId}
            homeworkId={homeworkId}
          >
            <WriteFormArea
              studyRoomId={studyRoomId}
              homeworkId={homeworkId}
            />
          </StudentHomeworkFormProvider>
        )}
      </ColumnLayout.Right>
    </>
  );
};
