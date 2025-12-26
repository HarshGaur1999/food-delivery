/**
 * Authentication Domain Models
 */

export interface OtpRequest {
  mobile: string;
}

export interface OtpVerifyRequest {
  mobile: string;
  otp: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    mobile: string;
    email?: string;
    role: string;
  };
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}








