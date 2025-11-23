import { MemberDTO } from '@/entities/member';
import { create } from 'zustand';

interface MemberState {
  member: MemberDTO | null;
  isAuthenticated: boolean;
  setMember: (member: MemberDTO | null) => void;
  clearMember: () => void;
}

export const useMemberStore = create<MemberState>((set) => ({
  member: null,
  isAuthenticated: false,
  setMember: (member) => set({ member, isAuthenticated: !!member }),
  clearMember: () => set({ member: null, isAuthenticated: false }),
}));
