import { Session1 } from '@/features/home/components/Session1';
import { Session2 } from '@/features/home/components/Session2';
import { Session3 } from '@/features/home/components/Session3';
import { Session4 } from '@/features/home/components/Session4';

export default function home() {
  return (
    <main className="flex flex-col items-center">
      <Session1 />
      <Session2 />
      <Session3 />
      <Session4 />
    </main>
  );
}
