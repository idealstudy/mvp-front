import { ConsultationListItem } from '@/entities/consultation';
import { StatusBadge } from '@/shared/components/ui';
import { ListItem } from '@/shared/components/ui/list-item';
import { PUBLIC } from '@/shared/constants';
import { getRelativeTimeString } from '@/shared/lib';

const STATUS_LABEL = { PENDING: '답변 대기', ANSWERED: '답변 완료' };

export default function MyConsultationItem({
  item,
}: {
  item: ConsultationListItem;
}) {
  return (
    <ListItem
      id={item.id}
      title={item.title}
      href={PUBLIC.CONSULTATION.DETAIL(item.id)}
      tag={
        item.studyRoomName && (
          <span className="bg-gray-2 font-caption-normal text-gray-8 rounded-sm px-1 py-0.5">
            {item.studyRoomName}
          </span>
        )
      }
      subtitle={getRelativeTimeString(item.regDate)}
      rightTitle={
        <StatusBadge
          label={STATUS_LABEL[item.status]}
          variant={item.status === 'PENDING' ? 'default' : 'primary'}
        />
      }
    />
  );
}
