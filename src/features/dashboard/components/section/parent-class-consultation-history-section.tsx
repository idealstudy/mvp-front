import { ParentDashboardInquiryListDTO } from '@/entities/parent';
import { Skeleton } from '@/shared/components/loading';

import { ClassConsultationHistoryItem } from '../section-content/parent-class-consultation-history-item';
import DashboardSection from './single-section';

interface ClassConsultationHistorySectionProps {
  inquiryListData: ParentDashboardInquiryListDTO;
  inquiryListIsPending: boolean;
}

export const ClassConsultationHistorySection = ({
  inquiryListData,
  inquiryListIsPending,
}: ClassConsultationHistorySectionProps) => {
  const inquiryList = inquiryListData.content;
  const inquiryListLength = inquiryList.length;

  let content;

  if (inquiryListIsPending) {
    content = (
      <div className="flex w-full flex-col gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton.Block
            key={i}
            className="h-12"
          />
        ))}
      </div>
    );
  } else if (inquiryListLength === 0) {
    content = (
      <div className="flex h-22 w-full flex-col items-center justify-center gap-3">
        <p className="font-body2-normal text-gray-8">상담 내역이 없어요.</p>
      </div>
    );
  } else {
    content = <ClassConsultationHistoryItem content={inquiryList} />;
  }

  return (
    <section>
      <DashboardSection
        title="나의 수업 상담하기 내역"
        description="선생님과 주고받은 문의사항을 확인하세요."
        isMore
        isMoreDescription="상담하기"
        isMoreHref="/list/teachers"
      >
        {content}
      </DashboardSection>
    </section>
  );
};
