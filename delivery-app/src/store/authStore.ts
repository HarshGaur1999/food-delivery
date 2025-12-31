/**
 * Authentication Store (Zustand)
 */

import {create} from 'zustand';
import {secureStorage} from '@services/secureStorage';
import {authRepository} from '@data/repositories/authRepository';
import {User, DeliveryBoyProfile} from '@domain/models/User';
import {AuthResponse} from '@domain/models/Auth';

interface AuthState {
  user: DeliveryBoyProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (mobile: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const authStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (mobile: string, otp: string) => {
    set({isLoading: true, error: null});
    try {
      const response: AuthResponse = await authRepository.verifyOtp({
        mobile,
        otp,
      });

      // Store tokens
      await secureStorage.setAccessToken(response.accessToken);
      await secureStorage.setRefreshToken(response.refreshToken);
      await secureStorage.setUserProfile(response.user);

      // Set user state
      const profile: DeliveryBoyProfile = {
        ...response.user,
        isAvailable: false,
        isOnDuty: false,
      };

      set({
        user: profile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
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
        const userProfile: DeliveryBoyProfile = {
          ...profile,
          isAvailable: false,
          isOnDuty: false,
        };
        set({
          user: userProfile,
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









