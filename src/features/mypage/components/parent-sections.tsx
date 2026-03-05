import ComingSoonSection from '@/features/profile/components/coming-soon-section';
import SectionContainer from '@/features/profile/components/section-container';

export default function ParentSections() {
  return (
    <>
      <SectionContainer title="학생의 활동 리포트">
        <ComingSoonSection />
      </SectionContainer>

      <SectionContainer title="학생이 참여한 스터디룸">
        <ComingSoonSection />
      </SectionContainer>
    </>
  );
}
