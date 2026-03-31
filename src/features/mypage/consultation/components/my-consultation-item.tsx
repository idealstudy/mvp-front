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
      subtitle={`${item.studyRoomName ? item.studyRoomName + ' ' : ''}${getRelativeTimeString(item.regDate)}`}
      rightTitle={
        <StatusBadge
          label={STATUS_LABEL[item.status]}
          variant={item.status === 'PENDING' ? 'default' : 'active'}
        />
      }
    />
  );
}
