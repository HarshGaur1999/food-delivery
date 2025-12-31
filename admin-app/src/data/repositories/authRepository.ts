import {apiClient} from '@services/apiClient';
import {ENDPOINTS} from '@config/api';

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminOtpRequest {
  emailOrPhone: string;
}

export interface AdminOtpVerifyRequest {
  emailOrPhone: string;
  otp: string;
}

export interface OtpResponse {
  message: string;
  expiresInSeconds: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    mobileNumber: string;
    fullName: string | null;
    email: string | null;
    role: string;
    isActive: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authRepository = {
  async login(request: AdminLoginRequest): Promise<AuthResponse> {
    const response = await apiClient.instance.post<ApiResponse<AuthResponse>>(
      ENDPOINTS.AUTH.LOGIN,
      request,
    );
    return response.data.data;
  },

  async sendAdminOtp(request: AdminOtpRequest): Promise<OtpResponse> {
    const response = await apiClient.instance.post<ApiResponse<OtpResponse>>(
      ENDPOINTS.AUTH.ADMIN_OTP_SEND,
      request,
    );
    return response.data.data;
  },

  async verifyAdminOtp(request: AdminOtpVerifyRequest): Promise<AuthResponse> {
    const response = await apiClient.instance.post<ApiResponse<AuthResponse>>(
      ENDPOINTS.AUTH.ADMIN_OTP_VERIFY,
      request,
    );
    return response.data.data;
  },
};





