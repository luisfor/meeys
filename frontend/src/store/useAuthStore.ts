import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  companyId: string | null;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => {
        // Establecer también una cookie para el middleware de validación a nivel red.
        Cookies.set('meys_token', token, { expires: 1 });
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove('meys_token');
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'meys-auth-storage', // Almacena en localStorage para hidratación instantánea
    }
  )
);
