import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 bg-[#F9F9F9]">
      <Sidebar />
      <div className="mx-auto max-w-[1200px] flex-1">{children}</div>
    </div>
  );
}
