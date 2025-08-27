import { cn } from '@/lib/utils';

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const LeftSortIcon = ({
  active,
  onClick,
}: {
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(active && 'text-black', 'mr-2 cursor-pointer')}
      onClick={onClick}
    >
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const RightSortIcon = ({
  active,
  onClick,
}: {
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(active && 'text-black', 'ml-2 cursor-pointer')}
      onClick={onClick}
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Pagination = ({ page, totalPages, onPageChange }: Props) => {
  const currentPage = page + 1;

  const getPages = (current: number, total: number) => {
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    if (current <= 4) {
      const endPage = Math.min(9, total);
      for (let i = 1; i <= endPage; i++) pages.push(i);
      if (endPage < total) pages.push('ellipsis', total);
    } else if (current >= total - 4) {
      pages.push(1, 'ellipsis');
      for (let i = Math.max(1, total - 8); i <= total; i++) pages.push(i);
    } else {
      pages.push(1, 'ellipsis');
      for (
        let i = Math.max(1, current - 4);
        i <= Math.min(total, current + 4);
        i++
      )
        pages.push(i);
      if (current + 3 < total) pages.push('ellipsis', total);
    }

    return pages;
  };

  const pages = getPages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center py-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 2)}
        className="cursor-pointer px-2 disabled:cursor-not-allowed disabled:text-gray-400"
      >
        <LeftSortIcon active={currentPage !== 1} />
      </button>

      {pages.map((p, idx) => (
        <button
          key={idx}
          onClick={() => typeof p === 'number' && onPageChange(p - 1)}
          disabled={p === 'ellipsis'}
          className={`h-7 cursor-pointer rounded px-2 ${p === currentPage ? 'bg-orange-scale-orange-1 text-key-color-primary rounded-[4px] font-bold' : 'text-gray-500'} ${p === 'ellipsis' ? 'cursor-default' : p !== currentPage ? 'hover:bg-gray-scale-gray-5' : ''} `}
        >
          {p === 'ellipsis' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="gray"
              viewBox="0 0 24 24"
            >
              <circle
                cx="5"
                cy="12"
                r="1.5"
              />
              <circle
                cx="12"
                cy="12"
                r="1.5"
              />
              <circle
                cx="19"
                cy="12"
                r="1.5"
              />
            </svg>
          ) : (
            p
          )}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage)}
        className="cursor-pointer px-2 disabled:cursor-not-allowed disabled:text-gray-400"
      >
        <RightSortIcon active={currentPage !== totalPages} />
      </button>
    </div>
  );
};
