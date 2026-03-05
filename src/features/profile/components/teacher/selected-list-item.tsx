import { cn } from '@/shared/lib';

export const SelectedListItem = ({
  title,
  onClick,
  subtitle,
  tag,
  icon,
  rightTitle,
  rightIcon,
  rightSubTitle,
  checked,
}: {
  title: React.ReactNode;
  onClick: () => void;
  subtitle?: string;
  icon?: React.ReactNode;
  tag?: React.ReactNode;
  rightTitle?: string;
  rightIcon?: React.ReactNode;
  rightSubTitle?: string;
  checked?: boolean;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'font-body2-normal desktop:max-w-[740px] flex h-[66px] w-full cursor-pointer flex-row items-center gap-4 rounded-[12px] px-4 py-3',
        checked && 'bg-background-orange border-ring border',
        !checked &&
          'border-line-line2 hover:bg-gray-scale-gray-1 border bg-white'
      )}
    >
      <div className="flex flex-1 flex-row items-center gap-3">
        {icon}
        <div className="flex flex-col items-start justify-between">
          <div className="flex flex-row items-center gap-2">
            <p>{title}</p>
            {tag && tag}
          </div>
          <p className="font-caption-normal text-gray-scale-gray-60">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex flex-row items-center gap-1">
          <p className="text-gray-scale-gray-70">{rightTitle}</p>
        </div>
        <p className="font-caption-normal text-gray-scale-gray-60">
          {rightSubTitle}
        </p>
      </div>
      {rightIcon}
    </button>
  );
};
