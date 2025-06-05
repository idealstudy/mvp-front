import { Role } from '../features/auth/type';

type ModalMessage = {
  title: string;
  content: string;
};

/**
 * @param role - 사용자 역할
 * @returns 역할에 따른 메시지
 * @description 사용자의 역할에 따라 다른 메시지를 반환합니다.
 */
export function translateModalMessage(role: Role): ModalMessage {
  switch (role) {
    case 'ROLE_STUDENT':
      return {
        title: '연결할 선생님이 있으신가요?',
        content:
          '선생님과 연결되어야 수업로그를 열람할 수 있어요. 나중에 연결 관리에서 추가할 수 있어요.',
      };
    case 'ROLE_PARENT':
      return {
        title: '연결할 학생이 있으신가요?',
        content:
          '자녀의 학습 현황을 확인하려면 학생 아이디가 필요해요. 나중에 연결 관리에서 추가할 수 있어요.',
      };
    default:
      return {
        title: '환영합니다',
        content: '대시보드에서 다양한 정보를 확인하실 수 있습니다.',
      };
  }
}
