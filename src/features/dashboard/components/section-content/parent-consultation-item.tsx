import { ChevronRight } from 'lucide-react';

type ConsultationItem = {
  id: string;
  date: string;
  preview: string;
};

interface ConsultationItemProps {
  items: ConsultationItem[];
  onSelectItem: (id: string) => void;
}

export const ConsultationItem = ({
  items,
  onSelectItem,
}: ConsultationItemProps) => {
  return (
    <ul className="flex flex-col pr-1">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="group mb-4 flex items-stretch gap-3"
        >
          <div className="flex flex-col items-center">
            <div className="bg-gray-3 group-hover:bg-orange-3 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full transition-colors">
              <div className="bg-gray-6 group-hover:bg-orange-6 h-3 w-3 rounded-full" />
            </div>

            {index < items.length - 1 && (
              <div className="bg-gray-3 group-hover:bg-orange-3 mt-1 w-px flex-1 transition-colors" />
            )}
          </div>

          <button
            type="button"
            onClick={() => onSelectItem(item.id)}
            className="border-line-line1 flex w-full cursor-pointer items-start justify-between gap-3 rounded-xl border p-4 text-left transition-colors group-hover:shadow-lg"
            aria-label="기록 일지 보기"
          >
            <div className="min-w-0 flex-1">
              <p className="font-caption-normal text-gray-7 group-hover:text-orange-6 mb-1 transition-colors">
                {item.date}
              </p>
              <p className="font-body2-normal text-gray-10 line-clamp-3">
                {item.preview}
              </p>
            </div>
            <div className="shrink-0">
              <ChevronRight
                className="text-gray-5 transition-colors"
                size={20}
              />
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
};
