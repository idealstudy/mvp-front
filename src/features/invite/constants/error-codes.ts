export const INVITE_ERROR_CODE = {
  MEMBER_NOT_EXIST: '해당 ID를 가진 사용자가 존재하지 않습니다.',
  STUDY_ROOM_NOT_EXIST: '해당 ID의 스터디룸이 존재하지 않습니다.',
  INVITATION_EXPIRED: '초대장이 만료되었습니다.',
  DUPLICATED_INVITEE: '해당 수신자는 이미 초대를 받은 수신자 입니다.',
  STUDY_ROOM_CAPACITY_EXCEEDED: '초대하려는 인원 수가 수용인원을 초과합니다.',
} as const;

export type InviteErrorCode =
  (typeof INVITE_ERROR_CODE)[keyof typeof INVITE_ERROR_CODE];
