export interface LoginResponse {
  token: string;
}

export type Role = 'ROLE_STUDENT' | 'ROLE_PARENT' | 'ROLE_TEACHER';

export type JWT = {
  auth: Role;
  exp: number;
  sub: string;
};
