import {create} from 'zustand';
import {secureStorage} from '@services/secureStorage';
import {authRepository, AuthResponse} from '@data/repositories/authRepository';

interface User {
  id: number;
  mobileNumber: string;
  fullName: string | null;
  email: string | null;
  role: string;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const authStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({isLoading: true, error: null});
    try {
      const response: AuthResponse = await authRepository.login({
        username,
        password,
      });

      await secureStorage.setAccessToken(response.accessToken);
      await secureStorage.setRefreshToken(response.refreshToken);
      await secureStorage.setUserProfile(response.user);

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Login failed',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await secureStorage.clear();
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  checkAuth: async () => {
    set({isLoading: true});
    try {
      const token = await secureStorage.getAccessToken();
      const profile = await secureStorage.getUserProfile();

      if (token && profile) {
        set({
          user: profile,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({error: null});
  },
}));




