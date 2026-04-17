import { ConnectListPayload, ConnectSearchPayload } from '../types';

// 무효화 키, 조회용 키
export const connectionKeys = {
  all: ['connection'] as const,
  lists: () => [...connectionKeys.all, 'list'] as const,
  list: (query: ConnectListPayload) =>
    [...connectionKeys.lists(), query] as const,

  sentLists: () => [...connectionKeys.all, 'sent'] as const,
  sentList: (query: ConnectListPayload) =>
    [...connectionKeys.sentLists(), query] as const,

  receivedLists: () => [...connectionKeys.all, 'received'] as const,
  receivedList: (query: ConnectListPayload) =>
    [...connectionKeys.receivedLists(), query] as const,

  searches: () => [...connectionKeys.all, 'search'] as const,
  search: (query: ConnectSearchPayload) =>
    [...connectionKeys.searches(), query] as const,
};
