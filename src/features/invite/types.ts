const INVITE_LINK_ERROR_REASONS = ['EXPIRED_LINK', 'INVALID_LINK'] as const;
type InviteLinkErrorReason = (typeof INVITE_LINK_ERROR_REASONS)[number];

const ERROR_REASONS = [
  'ROLE_NOT_MATCH',
  'ALREADY_PARTICIPATED',
  'STUDY_ROOM_CAPACITY_EXCEEDED',
  'CLOSED',
  ...INVITE_LINK_ERROR_REASONS,
] as const;

export type ErrorReason = (typeof ERROR_REASONS)[number];

export function isErrorReason(
  reason: string | undefined
): reason is ErrorReason {
  return reason != null && ERROR_REASONS.includes(reason as ErrorReason);
}

export function isInviteLinkErrorReason(
  reason: string
): reason is InviteLinkErrorReason {
  return (
    reason != null &&
    INVITE_LINK_ERROR_REASONS.includes(reason as InviteLinkErrorReason)
  );
}
