/**
 * API Client with Axios
 * Handles authentication, token refresh, and error handling
 */

import axios, {AxiosInstance, AxiosError, InternalAxiosRequestConfig} from 'axios';
import {API_CONFIG} from '@config/api';
import {ENDPOINTS} from '@config/api';
import {secureStorage} from '@services/secureStorage';
import {authStore} from '@store/authStore';
import {isUnauthorizedError, handleApiError} from '@utils/errors';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await secureStorage.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor - Handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 Unauthorized
        if (isUnauthorizedError(error) && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({resolve, reject});
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await secureStorage.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await axios.post(
              `${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              },
            );

            const {accessToken, refreshToken: newRefreshToken} = response.data.data;
            await secureStorage.setAccessToken(accessToken);
            await secureStorage.setRefreshToken(newRefreshToken);

            // Process queued requests
            this.processQueue(null, accessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed - logout user
            this.processQueue(refreshError, null);
            authStore.getState().logout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  async get<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await this.client.get<{success: boolean; message: string; data: T}>(url, config);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Request failed');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.client.post<{success: boolean; message: string; data: T}>(url, data, config);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Request failed');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.client.put<{success: boolean; message: string; data: T}>(url, data, config);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Request failed');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.client.patch<{success: boolean; message: string; data: T}>(url, data, config);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Request failed');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await this.client.delete<{success: boolean; message: string; data: T}>(url, config);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Request failed');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    const message = handleApiError(error);
    const appError = new Error(message);
    (appError as any).statusCode = error.response?.status;
    (appError as any).code = error.response?.data?.code;
    return appError;
  }
}

export const apiClient = new ApiClient();

