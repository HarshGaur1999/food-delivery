/**
 * Authentication Repository
 */

import {apiClient} from '@data/api/apiClient';
import {ENDPOINTS} from '@config/api';
import {OtpRequest, OtpVerifyRequest, AuthResponse, TokenRefreshResponse} from '@domain/models/Auth';

export const authRepository = {
  sendOtp: async (request: OtpRequest): Promise<{otpSent: boolean}> => {
    return apiClient.post(ENDPOINTS.AUTH.SEND_OTP, request);
  },

  verifyOtp: async (request: OtpVerifyRequest): Promise<AuthResponse> => {
    return apiClient.post(ENDPOINTS.AUTH.VERIFY_OTP, request);
  },

  refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    // This is handled by the interceptor, but we can expose it if needed
    const response = await apiClient.post(ENDPOINTS.AUTH.REFRESH_TOKEN, {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return response;
  },
};











