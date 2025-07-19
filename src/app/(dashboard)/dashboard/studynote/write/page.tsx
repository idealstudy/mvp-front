import { ColumnLayout } from '@/components/layout/column-layout';
import BackLink from '@/features/dashboard/studynote/components/back-link';
import SelectArea from '@/features/dashboard/studynote/write/components/select-area';
import WriteArea from '@/features/dashboard/studynote/write/components/write-area';

export default function SettingsPage() {
  return (
    <>
      <div className="desktop:flex desktop:flex-row mt-[34px] hidden w-full flex-col justify-center gap-5">
        <span className="w-[360px]">
          <BackLink />
        </span>
        <span className="desktop:max-w-[740px] w-full" />
      </div>
      <ColumnLayout className="pt-[10px] pb-10">
        <SelectArea />
        <WriteArea />
      </ColumnLayout>
    </>
  );
}
