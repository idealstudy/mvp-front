export type ConnectionSort = ('regDate' | 'DESC' | 'ASC')[];
export type ConnectionState =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'TERMINATED';

export interface ConnectionListRequestParams {
  page?: number;
  size?: number;
  sort?: ConnectionSort;
  state: ConnectionState;
}

export interface ConnectionItem {
  id: number;
  requesterEmail: string;
  recipientEmail: string;
  state: ConnectionState;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionListResponse {
  last: false;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  connectionList: ConnectionItem[];
}
