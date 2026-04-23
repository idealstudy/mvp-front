import {
  Session1,
  Session2,
  Session3,
  Session4,
  Session5,
  Session6,
} from '@/features/home';
import { homeMetadata } from '@/features/home/metadata';
import { StructuredData } from '@/features/home/structured-data';
import FloatingCTA from '@/features/home/ui/floating-cta';
import { Footer } from '@/layout/footer';
import { PageViewTracker } from '@/shared/components/analytics';
import { cn } from '@/shared/lib';

export const metadata = homeMetadata;

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <PageViewTracker pageName="home" />

      <main className="flex flex-col">
        <Session1 />

        <div
          className={cn(
            'mx-auto my-8 flex w-81 flex-col gap-8',
            'tablet:my-12 tablet:w-[608px] tablet:gap-12',
            'desktop:my-20 desktop:w-[912px] desktop:gap-25'
          )}
        >
          <Session2 />
          <Session3 />
          <Session4 />
        </div>

        <Session5 />
        <Session6 />
        <Footer />

        <FloatingCTA />
      </main>
    </>
  );
}
