'use client';

import { cn } from '@/shared/lib';
import { createContextFactory } from '@/shared/lib/context';

type PaginationProps = Omit<React.ComponentPropsWithRef<'nav'>, 'onChange'> & {
  page: number;
  onPageChange: (page: number) => void;
  totalPages: number;
};

interface PaginationItem extends React.ComponentPropsWithoutRef<'button'> {
  page: number;
}

const PaginationItem = ({ page, ...props }: PaginationItem) => {
  const { page: currentPage, onPageChange } = usePaginationContext();

  const isActive = page === currentPage;

  const onClick = () => {
    onPageChange(page);
  };

  return (
    <button
      className={cn(
        'bg-gray-scale-white text-text-sub1 hover:bg-background-gray flex size-[28px] cursor-pointer items-center justify-center rounded-[4px]',
        isActive && 'text-key-color-primary bg-background-orange font-medium'
      )}
      aria-label="페이지 이동"
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
      {...props}
    >
      {page}
    </button>
  );
};

const Pagination = ({
  className,
  page,
  onPageChange,
  totalPages,
  ...props
}: PaginationProps) => {
  const currentPage = page;

  const renderPages = () => {
    if (totalPages <= 10) {
      return Array(totalPages)
        .fill(0)
        .map((_, index) => (
          <PaginationItem
            key={index}
            page={index + 1}
          />
        ));
    }

    if (page <= 5) {
      return (
        <>
          <PaginationItem page={1} />
          <PaginationItem page={2} />
          <PaginationItem page={3} />
          <PaginationItem page={4} />
          <PaginationItem page={5} />
          <PaginationItem page={6} />
          <PaginationEllipsis />
          <PaginationItem page={totalPages - 1} />
          <PaginationItem page={totalPages} />
        </>
      );
    }

    if (page >= 6 && page <= totalPages - 5) {
      return (
        <>
          <PaginationItem page={1} />
          <PaginationItem page={2} />
          <PaginationEllipsis />
          <PaginationItem page={currentPage - 1} />
          <PaginationItem page={currentPage} />
          <PaginationItem page={currentPage + 1} />
          <PaginationEllipsis />

          <PaginationItem page={totalPages - 1} />
          <PaginationItem page={totalPages} />
        </>
      );
    }

    return (
      <>
        <PaginationItem page={1} />
        <PaginationItem page={2} />
        <PaginationEllipsis />
        <PaginationItem page={totalPages - 5} />
        <PaginationItem page={totalPages - 4} />
        <PaginationItem page={totalPages - 3} />
        <PaginationItem page={totalPages - 2} />
        <PaginationItem page={totalPages - 1} />
        <PaginationItem page={totalPages} />
      </>
    );
  };

  const value = {
    page,
    onPageChange,
  };

  if (totalPages === 0) return null;

  return (
    <PaginationContext.Provider value={value}>
      <nav
        className={cn('text-sub flex items-center gap-2', className)}
        {...props}
      >
        <Navigation
          aria-label="처음 페이지로 이동"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
        >
          <ChevronsLeftIcon />
        </Navigation>
        <Navigation
          aria-label="이전 페이지로 이동"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeftIcon />
        </Navigation>
        <div className="bg-background flex items-center gap-1 p-1">
          {renderPages()}
        </div>
        <Navigation
          aria-label="다음 페이지로 이동"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRightIcon />
        </Navigation>
        <Navigation
          aria-label="마지막 페이지로 이동"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
        >
          <ChevronsRightIcon />
        </Navigation>
      </nav>
    </PaginationContext.Provider>
  );
};

type NavigationProps = React.ComponentPropsWithoutRef<'button'>;

const Navigation = ({ className, children, ...props }: NavigationProps) => {
  return (
    <button
      className={cn(
        'text-text-sub1 hover:bg-background-gray flex size-[28px] cursor-pointer items-center justify-center rounded-[4px]',
        'disabled:text-text-inactive disabled:pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const PaginationEllipsis = () => {
  return (
    <p className="flex size-[28px] items-center justify-center rounded-[4px]">
      <EllipsisIcon />
    </p>
  );
};

const EllipsisIcon = () => {
  return (
    <svg
      className="mt-2"
      width="10"
      height="3"
      viewBox="0 0 10 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.78906 2.08203C1.31055 2.08203 0.900391 1.68555 0.914062 1.19336C0.900391 0.714844 1.31055 0.318359 1.78906 0.318359C2.26758 0.318359 2.66406 0.714844 2.66406 1.19336C2.66406 1.68555 2.26758 2.08203 1.78906 2.08203ZM5.34375 2.08203C4.86523 2.08203 4.45508 1.68555 4.46875 1.19336C4.45508 0.714844 4.86523 0.318359 5.34375 0.318359C5.82227 0.318359 6.21875 0.714844 6.21875 1.19336C6.21875 1.68555 5.82227 2.08203 5.34375 2.08203ZM8.89844 2.08203C8.41992 2.08203 8.00977 1.68555 8.02344 1.19336C8.00977 0.714844 8.41992 0.318359 8.89844 0.318359C9.37695 0.318359 9.77344 0.714844 9.77344 1.19336C9.77344 1.68555 9.37695 2.08203 8.89844 2.08203Z"
        fill="#111111"
      />
    </svg>
  );
};

type PaginationContextValue = {
  page: number;
  onPageChange: (page: number) => void;
};

const [PaginationContext, usePaginationContext] =
  createContextFactory<PaginationContextValue>('Pagination');

export { Pagination };

const ChevronLeftIcon = () => {
  return (
    <svg
      width="10"
      height="16"
      viewBox="0 0 10 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
    >
      <path
        d="M8.36328 1.63672L1.99932 8.00068L8.36328 14.3646"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

const ChevronsLeftIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
    >
      <g clipPath="url(#clip0_4495_11343)">
        <path
          d="M11.3633 5.63672L4.99932 12.0007L11.3633 18.3646"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M19.3633 5.63672L12.9993 12.0007L19.3633 18.3646"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4495_11343">
          <rect
            width="24"
            height="24"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

const ChevronRightIcon = () => {
  return (
    <svg
      width="9"
      height="16"
      viewBox="0 0 9 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
    >
      <path
        d="M1.36328 14.3633L7.72724 7.99932L1.36328 1.63536"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

const ChevronsRightIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
    >
      <g clipPath="url(#clip0_4495_11369)">
        <path
          d="M5.36328 18.3633L11.7272 11.9993L5.36328 5.63536"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M13.3633 18.3633L19.7272 11.9993L13.3633 5.63536"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4495_11369">
          <rect
            width="24"
            height="24"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
