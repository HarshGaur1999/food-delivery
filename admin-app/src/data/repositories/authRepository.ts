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
    console.log('🔐 [AuthRepository] login() called');
    console.log('🔐 [AuthRepository] Request:', JSON.stringify(request, null, 2));
    console.log('🔐 [AuthRepository] Endpoint:', ENDPOINTS.AUTH.LOGIN);
    try {
      const response = await apiClient.instance.post<ApiResponse<AuthResponse>>(
        ENDPOINTS.AUTH.LOGIN,
        request,
      );
      console.log('✅ [AuthRepository] login() success');
      return response.data.data;
    } catch (error: any) {
      console.error('❌ [AuthRepository] login() failed:', error);
      throw error;
    }
  },

  async sendAdminOtp(request: AdminOtpRequest): Promise<OtpResponse> {
    console.log('🔐 [AuthRepository] sendAdminOtp() called');
    console.log('🔐 [AuthRepository] Request:', JSON.stringify(request, null, 2));
    console.log('🔐 [AuthRepository] Endpoint:', ENDPOINTS.AUTH.ADMIN_OTP_SEND);
    try {
      const response = await apiClient.instance.post<ApiResponse<OtpResponse>>(
        ENDPOINTS.AUTH.ADMIN_OTP_SEND,
        request,
      );
      console.log('✅ [AuthRepository] sendAdminOtp() success');
      console.log('✅ [AuthRepository] Response:', JSON.stringify(response.data, null, 2));
      return response.data.data;
    } catch (error: any) {
      console.error('❌ [AuthRepository] sendAdminOtp() failed:', error);
      throw error;
    }
  },

  async verifyAdminOtp(request: AdminOtpVerifyRequest): Promise<AuthResponse> {
    console.log('🔐 [AuthRepository] verifyAdminOtp() called');
    console.log('🔐 [AuthRepository] Request (OTP masked):', {
      ...request,
      otp: '***',
    });
    console.log('🔐 [AuthRepository] Endpoint:', ENDPOINTS.AUTH.ADMIN_OTP_VERIFY);
    try {
      const response = await apiClient.instance.post<ApiResponse<AuthResponse>>(
        ENDPOINTS.AUTH.ADMIN_OTP_VERIFY,
        request,
      );
      console.log('✅ [AuthRepository] verifyAdminOtp() success');
      return response.data.data;
    } catch (error: any) {
      console.error('❌ [AuthRepository] verifyAdminOtp() failed:', error);
      throw error;
    }
  },
};





