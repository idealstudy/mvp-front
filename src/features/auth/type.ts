export interface LoginResponse {
  token: string;
}

export type Role = (typeof ROLES)[number];
export const ROLES = ['ROLE_STUDENT', 'ROLE_PARENT', 'ROLE_TEACHER'] as const;

export type JWT = {
  auth: Role;
  exp: number;
  sub: string;
};
