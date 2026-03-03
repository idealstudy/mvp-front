'use client';

import { Key } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ColumnLayout } from '@/layout/column-layout';
import { MiniSpinner } from '@/shared/components/loading';
import { useRole } from '@/shared/hooks/use-role';
import { cn } from '@/shared/lib/utils';

import { useQnADetailQuery } from '../../services/query';
import QuestionAnswer from '../sidebar/question-answer';
import QuestionContent from '../sidebar/question-content';
import QnAMessageFormProvider from '../write/qna-message-provider';
import WriteArea from '../write/qna-message-write-area';

type Props = {
  studyRoomId: number;
  contextId: number;
};

const statusMessage = {
  PENDING: '피드백 대기중',
  COMPLETED: '피드백 완료',
};

export function QuestionDetail({ studyRoomId, contextId }: Props) {
  const { role } = useRole();
  const { data: qnaDetail, isPending } = useQnADetailQuery(role, {
    studyRoomId,
    contextId,
  });

  const qnaVisibility = (visibility: string) => {
    if (visibility === 'STUDENT_ONLY') return '보호자 비공개';
    else if (visibility === 'STUDENT_AND_PARENT') return '보호자 공개';
    else return '-';
  };

  // 학생의 질문의 유무 체크
  const hasStudentQnA =
    qnaDetail?.messages.some((m) => m.authorType === 'ROLE_STUDENT') ?? false;

  // 질문/답변 작성 여부
  const canWrite =
    role === 'ROLE_STUDENT' || (role === 'ROLE_TEACHER' && hasStudentQnA);

  if (isPending) return <MiniSpinner />;

  return (
    <>
      <ColumnLayout.Left className="rounded-[12px] bg-white">
        <div className="border-line-line1 flex flex-col gap-5 rounded-xl border bg-white p-10">
          <span
            className={cn(
              'font-body1-normal',
              qnaDetail?.status === 'PENDING'
                ? 'text-orange-scale-orange-50'
                : 'text-gray-scale-gray-60'
            )}
          >
            {qnaDetail &&
              statusMessage[qnaDetail?.status as keyof typeof statusMessage]}
          </span>
          <h3 className="font-headline1-heading">{qnaDetail?.title}</h3>
          <hr className="text-gray-scale-gray-10" />
          <div className="font-label-normal flex cursor-default flex-col gap-2">
            <div className="bg-gray-scale-gray-1 text-gray-scale-gray-70 flex w-fit items-center gap-1 rounded-sm px-2 py-1">
              <Image
                src="/homework/link.svg"
                width={14}
                height={14}
                alt="study-notes"
                className="h-[14px] w-[14px]"
              />
              <span>연결 수업노트</span>
            </div>
            <div>
              {qnaDetail?.relatedTeachingNote ? (
                <Link
                  href={`/study-rooms/${studyRoomId}/note/${qnaDetail.relatedTeachingNote.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-scale-orange-50"
                >
                  {qnaDetail.relatedTeachingNote.title}
                </Link>
              ) : (
                <span className="text-gray-scale-gray-40">
                  연결된 수업노트가 없습니다.
                </span>
              )}
            </div>
          </div>
          <hr className="text-gray-scale-gray-10" />
          <div className="font-label-normal flex cursor-default flex-col gap-2">
            <div className="bg-gray-scale-gray-1 text-gray-scale-gray-70 flex w-fit items-center gap-1 rounded-sm px-2 py-1">
              <Image
                src="/qna/lock.svg"
                width={14}
                height={14}
                alt="study-notes"
                className="h-[14px] w-[14px]"
              />
              <span>공개범위</span>
            </div>
            <span>{qnaVisibility(qnaDetail?.visibility ?? '-')}</span>
          </div>
        </div>
      </ColumnLayout.Left>
      <ColumnLayout.Right className="desktop:min-w-[740px] flex h-[400px] w-full flex-col gap-3 rounded-[12px]">
        {qnaDetail?.messages.map(
          (msg: {
            authorType: string;
            id: Key | null | undefined;
            content: string;
            resolvedContent?: { content: string };
            regDate: string;
            authorName: string;
          }) => {
            if (msg.authorType === 'ROLE_TEACHER')
              return (
                <QuestionAnswer
                  key={msg.id}
                  id={Number(msg.id)}
                  content={msg.resolvedContent?.content || msg.content}
                  rawContent={msg.content}
                  regDate={msg.regDate}
                  studyRoomId={studyRoomId}
                  contextId={contextId}
                  qnaDetail={qnaDetail}
                />
              );
            else if (msg.authorType === 'ROLE_STUDENT')
              return (
                <QuestionContent
                  key={msg.id}
                  id={Number(msg.id)}
                  content={msg.resolvedContent?.content || msg.content}
                  rawContent={msg.content}
                  authorName={msg.authorName}
                  regDate={msg.regDate}
                  studyRoomId={studyRoomId}
                  contextId={contextId}
                  qnaDetail={qnaDetail}
                />
              );
          }
        )}
        {canWrite && (
          <QnAMessageFormProvider key={contextId}>
            <WriteArea
              studyRoomId={studyRoomId}
              contextId={contextId}
            />
          </QnAMessageFormProvider>
        )}
      </ColumnLayout.Right>
    </>
  );
}
