import { Icon } from '@/shared/components/ui/icon';
import { cn } from '@/shared/lib';

interface OnboardingControlButtonProps {
  canClose: boolean;
  isExpanded: boolean;
  onClose: () => void;
  onExpandToggle: () => void;
}

export const OnboardingControlButton = ({
  canClose,
  isExpanded,
  onClose,
  onExpandToggle,
}: OnboardingControlButtonProps) => (
  <>
    {/* tablet ~ desktop: 닫기 버튼 */}
    {canClose && (
      <button
        type="button"
        onClick={onClose}
        className="text-body2-normal text-gray-10 tablet:block hidden shrink-0"
      >
        닫기
      </button>
    )}
    {/* mobile: 닫기, 접기/펼치기 버튼 */}
    <div className="tablet:hidden flex shrink-0">
      {canClose ? (
        <button
          type="button"
          onClick={onClose}
          className="text-gray-10"
          aria-label="닫기"
        >
          <Icon.X className="size-6" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onExpandToggle}
          className="text-gray-10"
          aria-expanded={isExpanded}
          aria-label="접기/펼치기"
        >
          <Icon.ChevronDown
            className={cn(
              'text-gray-10 size-6 transition-transform',
              !isExpanded && 'rotate-180'
            )}
          />
        </button>
      )}
    </div>
  </>
);
