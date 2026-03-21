import { Pagination } from '@/shared/components/ui/pagination';

export const StudyRoomDetailLayout = ({
  filter,
  children,
  page,
}: {
  filter?: React.ReactNode;
  children: React.ReactNode;
  page: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}) => {
  return (
    <div className="border-line-line1 flex flex-col gap-6 rounded-[12px] border bg-white p-6 px-8">
      <div className="flex flex-col gap-3">
        {filter}
        {children}
      </div>
      <div className="flex justify-center">
        <Pagination {...page} />
      </div>
    </div>
  );
};
