import axios, {AxiosInstance, AxiosError} from 'axios';
import {API_CONFIG} from '@config/api';
import {secureStorage} from './secureStorage';
import {errorLogger} from '@utils/errorLogger';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    console.log('🔧 [API Client] Initializing with BASE_URL:', API_CONFIG.BASE_URL);
    console.log('🔧 [API Client] Timeout:', API_CONFIG.TIMEOUT);
    
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
        const fullUrl = `${config.baseURL}${config.url}`;
        
        // ✅ FIX: Define public endpoints that don't need token
        const publicEndpoints = [
          '/auth/admin/otp/send',
          '/auth/admin/otp/verify',
          '/auth/admin/login',
          '/auth/',
          '/health',
        ];
        
        // Check if this is a public endpoint
        const isPublicEndpoint = publicEndpoints.some(endpoint => 
          config.url?.includes(endpoint) || fullUrl.includes(endpoint)
        );
        
        // ✅ FIX: Skip token check for public endpoints
        if (isPublicEndpoint) {
          if (__DEV__) {
            console.log('🔓 [API Client] Public endpoint, no token required:', fullUrl);
          }
          
          // Log request without token check
          if (__DEV__) {
            console.log('📤 [API Request]', {
              method: config.method?.toUpperCase(),
              url: fullUrl,
              hasToken: false,
              isPublicEndpoint: true,
              hasBody: !!config.data,
            });
          }
          
          return config; // ✅ Return early without token check
        }
        
        // ✅ FIX: Check if this is a protected admin endpoint
        const isAdminEndpoint = config.url?.includes('/admin') || fullUrl.includes('/admin');
        
        if (isAdminEndpoint) {
          // MANDATORY: Read token directly from ADMIN_TOKEN key
          const token = await secureStorage.getAccessToken();
          
          if (!token) {
            const errorMsg = 'Authentication required: No token found. Please login first.';
            console.error('❌ [API Client] Admin endpoint called without token:', fullUrl);
            console.error('❌ [API Client] Error:', errorMsg);
            return Promise.reject(new Error(errorMsg));
          }
          
          // Attach token to Authorization header
          config.headers.Authorization = `Bearer ${token}`;
          
          if (__DEV__) {
            console.log('🔑 [API Client] Token attached to admin request:', {
              method: config.method?.toUpperCase(),
              url: fullUrl,
              tokenLength: token.length,
              tokenPreview: token.substring(0, 20) + '...',
            });
          }
        } else {
          // For non-admin endpoints, optionally attach token if available
          const token = await secureStorage.getAccessToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            if (__DEV__) {
              console.log('🔑 [API Client] Token attached to request:', {
                method: config.method?.toUpperCase(),
                url: fullUrl,
              });
            }
          }
        }
        
        // Consolidated request logging (dev mode only)
        if (__DEV__) {
          console.log('📤 [API Request]', {
            method: config.method?.toUpperCase(),
            url: fullUrl,
            hasToken: !!config.headers.Authorization,
            isAdminEndpoint,
            hasBody: !!config.data,
          });
        }
        
        return config;
      },
      error => {
        errorLogger.logApiError(error);
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      response => {
        // Only log responses in dev mode to reduce console noise
        if (__DEV__) {
          const fullUrl = `${response.config.baseURL}${response.config.url}`;
          console.log('✅ [API Response]', {
            status: response.status,
            method: response.config.method?.toUpperCase(),
            url: fullUrl,
            dataSize: JSON.stringify(response.data).length,
          });
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        const fullUrl = originalRequest ? `${originalRequest.baseURL}${originalRequest.url}` : 'Unknown URL';
        
        // Use consolidated error logger with deduplication and throttling
        errorLogger.logApiError(error, {
          url: fullUrl,
          baseURL: API_CONFIG.BASE_URL,
        });

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          console.log('🔄 [API] Attempting token refresh...');

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

              const {
                accessToken,
                refreshToken: newRefreshToken,
                user,
              } = response.data.data;

              // Validate role is ADMIN
              if (user && user.role !== 'ADMIN') {
                await secureStorage.clear();
                console.error('❌ [API] Invalid admin role after refresh');
                return Promise.reject(new Error('Unauthorized: Invalid admin role'));
              }

              await secureStorage.setAccessToken(accessToken);
              await secureStorage.setRefreshToken(newRefreshToken);
              if (user) {
                await secureStorage.setUserProfile(user);
              }

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              console.log('✅ [API] Token refreshed, retrying request');
              return this.client(originalRequest);
            }
          } catch (refreshError: any) {
            console.error('❌ [API] Token refresh failed:', refreshError);
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