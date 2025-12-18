import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  sendOtp: async (mobileNumber) => {
    const response = await api.post('/auth/otp/send', { mobileNumber });
    return response.data;
  },

  verifyOtp: async (mobileNumber, otp) => {
    const response = await api.post('/auth/otp/verify/customer', {
      mobileNumber,
      otp,
    });
    
    if (response.data.success) {
      const { accessToken, refreshToken, user } = response.data.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
  },

  getStoredUser: async () => {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  updateFcmToken: async (fcmToken) => {
    const response = await api.put('/customer/fcm-token', null, {
      params: { fcmToken },
    });
    return response.data;
  },
};







