import { Footer } from '@/components/layout/footer';

import { Session1 } from './_components/session-1';
import { Session2 } from './_components/session-2';
import { Session3 } from './_components/session-3';
import { Session4 } from './_components/session-4';

export default function home() {
  return (
    <main className="flex flex-col items-center">
      <Session1 />
      <Session2 />
      <Session3 />
      <Session4 />
      <Footer />
    </main>
  );
}
