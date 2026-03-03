import { cn } from '@/shared/lib';

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  isOwner?: boolean;
};

export default function SectionContainer({
  title,
  children,
  className,
  action,
  isOwner = false,
}: Props) {
  return (
    <div
      className={cn(
        'border-line-line1 flex flex-col gap-2 rounded-xl border bg-white px-8 py-6',
        className
      )}
    >
      <div className="flex justify-between">
        <h3 className="font-headline1-heading">{title}</h3>
        {isOwner && action}
      </div>
      {children}
    </div>
  );
}
