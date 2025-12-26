import axios, {AxiosInstance, AxiosError} from 'axios';
import {API_CONFIG} from '@config/api';
import {secureStorage} from './secureStorage';

class ApiClient {
  private client: AxiosInstance;

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

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      async config => {
        const token = await secureStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await secureStorage.getRefreshToken();
            if (refreshToken) {
              const response = await axios.post(
                `${API_CONFIG.BASE_URL}/auth/refresh`,
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

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            await secureStorage.clear();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();




