import ComingSoonSection from '@/features/profile/components/coming-soon-section';
import SectionContainer from '@/features/profile/components/section-container';

export default function StudentSections() {
  // TODO API 조회

  return (
    <>
      <SectionContainer title="누적 활동 리포트">
        <ComingSoonSection />
      </SectionContainer>

      <SectionContainer title="내 과제">
        <ComingSoonSection />
      </SectionContainer>

      <SectionContainer title="내 질문">
        <ComingSoonSection />
      </SectionContainer>

      <SectionContainer title="최근 등록된 수업노트">
        <ComingSoonSection />
      </SectionContainer>

      <SectionContainer title="참여한 스터디룸">
        <ComingSoonSection />
      </SectionContainer>
    </>
  );
}
