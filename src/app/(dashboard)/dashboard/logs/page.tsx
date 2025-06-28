import LogHeader from '@/features/dashboard/log/components/header';
import RecentlyList from '@/features/dashboard/log/components/recently-list';

export default function LogListPage() {
  return (
    <main className="max-w-[1344px] py-[92px]">
      <LogHeader />
      <hr className="mt-[115px] mb-[101px]" />
      <RecentlyList />
    </main>
  );
}
