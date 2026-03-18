import MypageSidebar from '@/features/mypage/common/components/mypage-sidebar';
import { ColumnLayout } from '@/layout';

type LayoutProps = {
  children: React.ReactNode;
};

export default function MypageLayout({ children }: LayoutProps) {
  return (
    <main className="bg-[#F9F9F9]">
      <ColumnLayout>
        <MypageSidebar />
        <ColumnLayout.Right className="desktop:max-w-[740px] desktop:px-8">
          <div className="flex flex-col gap-3">{children}</div>
        </ColumnLayout.Right>
      </ColumnLayout>
    </main>
  );
}
