import { Skeleton } from '@/shared/components/loading';

import {
  ClassConsultationHistoryItem,
  ClassConsultationHistoryItemType,
} from '../section-content/parent-class-consultation-history-item';
import DashboardSection from './single-section';

export const ClassConsultationHistorySection = () => {
  const isPending = false;

  const mockClassConsultationHistoryContent: ClassConsultationHistoryItemType[] =
    [
      {
        id: 1,
        teacherId: 101,
        teacherName: '김수학',
        title: '이번 주 수업 진도와 과제량이 적절한지 상담 요청드립니다.',
        status: 'PENDING',
        regDate: '2026-04-06T11:32:36.837Z',
      },
      {
        id: 2,
        teacherId: 102,
        teacherName: '이영어',
        title: '영어 단어 암기 방법과 복습 루틴에 대해 문의드렸습니다.',
        status: 'COMPLETED',
        regDate: '2026-04-05T09:12:10.000Z',
      },
      {
        id: 3,
        teacherId: 103,
        teacherName: '박과학',
        title: '과학 실험 보고서 작성 방향에 대해 추가 설명을 부탁드렸습니다.',
        status: 'PENDING',
        regDate: '2026-04-04T15:45:22.100Z',
      },
      {
        id: 4,
        teacherId: 104,
        teacherName: '최국어',
        title:
          '독서록 피드백 내용 중 보완이 필요한 부분을 다시 여쭤보았습니다.',
        status: 'COMPLETED',
        regDate: '2026-04-03T07:28:55.400Z',
      },
      {
        id: 5,
        teacherId: 105,
        teacherName: '정사회',
        title: '사회 시험 대비 학습 계획과 보충 자료 제공 여부를 문의했습니다.',
        status: 'PENDING',
        regDate: '2026-04-02T13:05:44.230Z',
      },
      {
        id: 9007199254740996,
        teacherId: 9007199254740006,
        teacherName: '한과학',
        title:
          '과학 수행평가 준비를 위해 참고하면 좋은 자료가 있을지 문의드렸습니다.',
        status: 'PENDING',
        regDate: '2026-04-01T10:18:21.000Z',
      },
    ];

  return (
    <section>
      <DashboardSection
        title="나의 수업 상담하기 내역"
        description="선생님과 주고받은 문의사항을 확인하세요."
      >
        {isPending ? (
          <div className="flex w-full flex-col gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton.Block
                key={i}
                className="h-12"
              />
            ))}
          </div>
        ) : (
          <ClassConsultationHistoryItem
            content={mockClassConsultationHistoryContent}
          />
        )}
      </DashboardSection>
    </section>
  );
};
