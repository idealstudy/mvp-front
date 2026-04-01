import { PreviewConsultationItem } from '@/entities/study-room-preview';
import { StatusBadge } from '@/shared/components/ui';

export default function ConsultationItem({
  item,
}: {
  item: PreviewConsultationItem;
}) {
  return (
    <li className="hover:bg-background-gray rounded-md p-3">
      <p>비공개 문의글</p>
      <div className="font-caption-normal text-gray-8 flex items-center gap-4">
        <span>{item.regDate.split('T')[0]} 작성</span>
        <span>*** {item.inquirerRole}</span>
        <StatusBadge
          variant={item.status === 'ANSWERED' ? 'success' : 'primary'}
          label={item.status === 'ANSWERED' ? '답변 완료' : '답변 대기'}
          className="font-caption-heading"
        />
      </div>
    </li>
  );
}
