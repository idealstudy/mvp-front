import { Metadata } from 'next';

import { MyStudyRoomListContainer } from '@/features/study-rooms/components';

export const metadata: Metadata = {
  title: '스터디룸 목록',
};

const MyStudyRoomListPage = () => {
  return <MyStudyRoomListContainer />;
};

export default MyStudyRoomListPage;
