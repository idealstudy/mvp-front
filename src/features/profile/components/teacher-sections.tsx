import ComingSoonSection from '@/features/profile/components/coming-soon-section';
import SectionContainer from '@/features/profile/components/section-container';

export default function TeacherSections() {
  // TODO API 조회

  return (
    <>
      <SectionContainer title="활동 요약">
        <ComingSoonSection />
      </SectionContainer>

      <SectionContainer title="후기">
        <ComingSoonSection />
      </SectionContainer>

      <SectionContainer title="경력">
        <ComingSoonSection />
      </SectionContainer>

      <SectionContainer title="대표 수업노트">
        <ComingSoonSection />
        {/* <StudynotesSection profile={profile} /> */}
      </SectionContainer>

      <SectionContainer title="운영중인 스터디룸">
        <ComingSoonSection />
        {/* <StudyroomSection profile={profile} /> */}
      </SectionContainer>
    </>
  );
}
