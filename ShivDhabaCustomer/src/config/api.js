import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this with your backend URL
// For Android Emulator: use 'http://10.0.2.2:8080/api/v1'
// For iOS Simulator: use 'http://localhost:8080/api/v1'
// For Physical Device: use 'http://YOUR_COMPUTER_IP:8080/api/v1'
const API_BASE_URL = 'http://192.168.29.104:8080/api/v1'; // Updated to current IP address

export {API_BASE_URL};

const api = axios.create({      //
  baseURL: API_BASE_URL, 
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('API Request:', config.method?.toUpperCase(), fullUrl);
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Enhanced error logging for network issues
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      const fullUrl = `${error.config?.baseURL}${error.config?.url}`;
      console.error('🚨 Network Error Details:');
      console.error('  - URL:', fullUrl);
      console.error('  - Base URL:', error.config?.baseURL);
      console.error('  - Error Code:', error.code);
      console.error('  - Error Message:', error.message);
      console.error('  - Troubleshooting:');
      console.error('    1. Verify backend is running on', API_BASE_URL.replace('/api/v1', ''));
      console.error('    2. Check if device and computer are on same WiFi network');
      console.error('    3. Verify Windows Firewall allows port 8080');
      console.error('    4. Test in browser:', fullUrl);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        // Navigate to login
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

