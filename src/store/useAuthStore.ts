import { create } from 'zustand';
import { UserProfile } from '@/types';
import { StorageService } from '@/services/storageService';

interface AuthState {
  users: Record<string, UserProfile>;
  currentUser: UserProfile;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  loginDemo: (email: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const users = StorageService.getUsers();
  const currentId = StorageService.getCurrentUserId();
  const currentUser = users[currentId] || Object.values(users)[0];

  return {
    users,
    currentUser,
    isAuthenticated: true,
    isDemoMode: true,

    switchUser: (userId: string) => {
      const { users } = get();
      if (users[userId]) {
        StorageService.setCurrentUserId(userId);
        set({ currentUser: users[userId], isAuthenticated: true });
      }
    },

    updateProfile: (updates: Partial<UserProfile>) => {
      const { users, currentUser } = get();
      const updated = { ...currentUser, ...updates };
      const newUsers = { ...users, [currentUser.id]: updated };
      StorageService.saveUsers(newUsers);
      set({ currentUser: updated, users: newUsers });
    },

    loginDemo: (email: string) => {
      const { users } = get();
      const found = Object.values(users).find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (found) {
        StorageService.setCurrentUserId(found.id);
        set({ currentUser: found, isAuthenticated: true });
        return true;
      }
      return false;
    },

    logout: () => {
      set({ isAuthenticated: false });
    },
  };
});

