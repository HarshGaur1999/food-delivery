import {apiClient} from '@services/apiClient';
import {ENDPOINTS} from '@config/api';

export interface AdminLoginRequest {
  username: string;
  password: string;
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
};




