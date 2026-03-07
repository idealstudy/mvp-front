import ComingSoonSection from '@/features/profile/components/coming-soon-section';
import SectionContainer from '@/features/profile/components/section-container';
import CareerSection from '@/features/profile/components/teacher/career-section';
import DescriptionSection from '@/features/profile/components/teacher/description-section';
import { useProfileCareers } from '@/features/profile/hooks/use-profile-careers';
import { useProfileDescription } from '@/features/profile/hooks/use-profile-description';

export default function TeacherSections({ teacherId }: { teacherId: number }) {
  // TODO API 조회
  const { data: description } = useProfileDescription(teacherId);
  const { data: careers } = useProfileCareers(teacherId);

  return (
    <>
      <SectionContainer title="선생님의 특징">
        {description?.description && (
          <DescriptionSection description={description} />
        )}
      </SectionContainer>

      <SectionContainer title="활동 요약">
        <ComingSoonSection />
      </SectionContainer>

      <SectionContainer title="후기">
        <ComingSoonSection />
      </SectionContainer>

      <SectionContainer title="경력">
        {careers && <CareerSection careers={careers} />}
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
