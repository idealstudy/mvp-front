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
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block cursor-pointer"
      onClick={onClick}
    >
      <path
        d="M10.5 4C10.2 4 10 4.1 9.8 4.3L5.3 8C5.1 8.2 5.1 8.5 5.3 8.7L9.8 11.7C10 11.9 10.2 12 10.5 12C11 12 11.5 11.6 11.5 11V5C11.5 4.4 11 4 10.5 4Z"
        fill={active ? '#1A1A1A' : '#C8C8C8'}
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
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block cursor-pointer"
      onClick={onClick}
    >
      <path
        d="M5.5 4C5.8 4 6 4.1 6.2 4.3L10.7 8C10.9 8.2 10.9 8.5 10.7 8.7L6.2 11.7C6 11.9 5.8 12 5.5 12C5 12 4.5 11.6 4.5 11V5C4.5 4.4 5 4 5.5 4Z"
        fill={active ? '#1A1A1A' : '#C8C8C8'}
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

    if (current <= 3) {
      pages.push(1, 2, 3, 4, 5, '...', total);
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(
        1,
        '...',
        current - 2,
        current - 1,
        current,
        current + 1,
        current + 2,
        '...',
        total
      );
    }

    return pages;
  };

  const pages = getPages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 py-4">
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
          disabled={p === '...'}
          className={`cursor-pointer rounded px-3 py-1 ${p === currentPage ? 'font-bold text-black' : 'text-gray-500'} ${p === '...' ? 'cursor-default' : 'hover:text-black'} `}
        >
          {p}
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
