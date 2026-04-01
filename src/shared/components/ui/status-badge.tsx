import { cn } from '@/shared/lib';

type Variant = 'default' | 'primary' | 'success' | 'warning';

const BADGE_STYLE: Record<Variant, string> = {
  default: 'bg-gray-1',
  primary: 'bg-orange-1 text-key-color-primary',
  success: 'bg-system-success-alt text-system-success',
  warning: 'bg-system-warning-alt text-system-warning',
};

export const StatusBadge = ({
  variant,
  label,
  className,
}: {
  variant: Variant;
  label: string;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        'font-label-normal rounded px-3 py-1.5 whitespace-nowrap',
        BADGE_STYLE[variant],
        className
      )}
    >
      {label}
    </span>
  );
};
