import { MiniSpinner } from '@/shared/components/loading';
import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/lib';

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  isOwner?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

export default function SectionContainer({
  title,
  children,
  className,
  action,
  isOwner = false,
  isLoading = false,
  isError = false,
  onRetry,
}: Props) {
  const renderContent = () => {
    if (isLoading) return <MiniSpinner />;
    if (isError)
      return (
        <div className="my-4 space-y-4 text-center">
          <p className="text-text-sub2">
            데이터를 불러오는 중 오류가 발생했습니다.
          </p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="secondary"
              size="small"
            >
              다시 시도
            </Button>
          )}
        </div>
      );
    return children;
  };
  return (
    <div
      className={cn(
        'border-line-line1 flex flex-col gap-2 rounded-xl border bg-white px-8 py-6',
        className
      )}
    >
      <div className="flex justify-between">
        <h3 className="font-headline1-heading mb-2">{title}</h3>
        {isOwner && action}
      </div>

      {renderContent()}
    </div>
  );
}
