import {create} from 'zustand';
import {secureStorage} from '@services/secureStorage';
import {
  authRepository,
  AuthResponse,
  OtpResponse,
} from '@data/repositories/authRepository';

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
  otpEmailOrPhone: string | null;
  login: (username: string, password: string) => Promise<void>;
  sendAdminOtp: (emailOrPhone: string) => Promise<OtpResponse>;
  verifyAdminOtp: (emailOrPhone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  setOtpEmailOrPhone: (emailOrPhone: string | null) => void;
}

export const authStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpEmailOrPhone: null,

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

  sendAdminOtp: async (emailOrPhone: string): Promise<OtpResponse> => {
    console.log('📱 [AuthStore] sendAdminOtp() called with:', emailOrPhone);
    set({isLoading: true, error: null});
    try {
      const response: OtpResponse = await authRepository.sendAdminOtp({
        emailOrPhone: emailOrPhone.trim(),
      });

      console.log('✅ [AuthStore] sendAdminOtp() success');
      set({
        isLoading: false,
        error: null,
        otpEmailOrPhone: emailOrPhone.trim(),
      });

      return response;
    } catch (error: any) {
      console.error('❌ [AuthStore] sendAdminOtp() error:', error);
      console.error('❌ [AuthStore] Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to send OTP';
      console.error('❌ [AuthStore] Setting error message:', errorMessage);
      
      set({
        error: errorMessage,
        isLoading: false,
        otpEmailOrPhone: null,
      });
      throw error;
    }
  },

  verifyAdminOtp: async (emailOrPhone: string, otp: string) => {
    set({isLoading: true, error: null});
    try {
      const response: AuthResponse = await authRepository.verifyAdminOtp({
        emailOrPhone: emailOrPhone.trim(),
        otp: otp.trim(),
      });

      // Validate role is ADMIN
      if (response.user.role !== 'ADMIN') {
        throw new Error('Unauthorized: Invalid admin role');
      }

      await secureStorage.setAccessToken(response.accessToken);
      await secureStorage.setRefreshToken(response.refreshToken);
      await secureStorage.setUserProfile(response.user);

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        otpEmailOrPhone: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'OTP verification failed';
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  setOtpEmailOrPhone: (emailOrPhone: string | null) => {
    set({otpEmailOrPhone: emailOrPhone});
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
        // Validate role is ADMIN
        if (profile.role !== 'ADMIN') {
          await secureStorage.clear();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

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
      await secureStorage.clear();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({error: null});
  },
}));





