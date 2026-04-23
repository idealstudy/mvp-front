'use client';

import { useState } from 'react';

import Link from 'next/link';

import { MiniSpinner } from '@/shared/components/loading';
import { useRole } from '@/shared/hooks/use-role';
import { trackQuestionClick } from '@/shared/lib/analytics';
import { getRelativeTimeString } from '@/shared/lib/utils';
import { useMemberStore } from '@/store';

import { QnAListItem } from '../../types';
import QuestionDropDown from './qna-dropdown';

type Props = {
  studyRoomId: number;
  data: QnAListItem[];
  isPending: boolean;
};

export default function QuestionList({ studyRoomId, data, isPending }: Props) {
  const { role } = useRole();
  const session = useMemberStore((s) => s.member);
  const [open, setOpen] = useState(0);

  const handleOpen = (id: number) => {
    setOpen(open === id ? 0 : id);
  };

  const handleQuestionClick = (questionId: number) => {
    // 질문 클릭 이벤트
    trackQuestionClick(studyRoomId, questionId, session?.role ?? null);
  };

  if (isPending) return <MiniSpinner />;

  return (
    <div className="gap-2">
      {data.length !== 0 ? (
        data.map((question) => {
          return (
            <Link
              key={question.id}
              className="font-body2-normal hover:bg-gray-scale-gray-1 desktop:max-w-[740px] flex h-[66px] w-full flex-row items-center justify-between gap-4 bg-white px-4 py-3 hover:rounded-[12px]"
              href={`/study-rooms/${studyRoomId}/qna/${question.id}`}
              onClick={() => handleQuestionClick(question.id)}
            >
              <div className="flex flex-row items-center gap-3">
                <div className="flex flex-col items-start justify-between">
                  <div className="font-label-normal flex flex-row items-center gap-[10px]">
                    {question.status === 'PENDING' ? (
                      <span className="border-orange-scale-orange-50 text-orange-scale-orange-50 bg-orange-scale-orange-1 rounded-full border px-3 py-[2px]">
                        피드백 대기
                      </span>
                    ) : (
                      <span className="border-gray-scale-gray-60 text-gray-scale-gray-60 bg-gray-scale-gray-1 rounded-full border px-3 py-[2px]">
                        피드백 완료
                      </span>
                    )}
                    <span className="font-body2-normal">{question.title}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center gap-5">
                {role === 'ROLE_TEACHER' && (
                  <div className="flex flex-row gap-2">
                    <div className="bg-gray-scale-gray-20 h-6 w-6 rounded-full" />
                    <p>{question.authorName}</p>
                  </div>
                )}

                <div className="flex gap-1">
                  <p className="text-gray-scale-gray-70">
                    {getRelativeTimeString(question.regDate)}
                  </p>
                  <div
                    className="flex shrink-0 flex-row items-center"
                    onClick={(e) => e.preventDefault()}
                  >
                    <QuestionDropDown
                      open={open}
                      handleOpen={handleOpen}
                      item={question}
                      studyRoomId={studyRoomId}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })
      ) : data.length === 0 ? (
        // TODO: 질문 없을때 예외 처리
        <div className="mt-2 w-full text-center">
          <span className="text-gray-scale-gray-20">
            작성된 질문이 없습니다
          </span>
        </div>
      ) : (
        <div className="mt-2 w-full text-center">
          <MiniSpinner />
        </div>
      )}
    </div>
  );
}
