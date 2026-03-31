import BackLink from '@/features/dashboard/studynote/components/back-link';

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1440px] pt-8 pb-20 lg:px-20">
      <BackLink />
      <div className="border-line-line1 mt-4 h-fit w-full rounded-xl border bg-white px-8 py-10">
        {children}
      </div>
    </div>
  );
}
