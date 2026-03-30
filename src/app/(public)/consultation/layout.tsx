import CommunityPageWrapper from '@/features/community/components/community-page-wrapper';
import BackLink from '@/features/dashboard/studynote/components/back-link';

export default function ConsultationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CommunityPageWrapper>
      <div className="mx-auto max-w-[1440px] px-4 pt-8 pb-20 md:px-8 lg:px-20">
        <BackLink />
        <div className="border-line-line1 mt-4 h-fit w-full rounded-xl border bg-white px-8 py-10">
          {children}
        </div>
      </div>
    </CommunityPageWrapper>
  );
}
