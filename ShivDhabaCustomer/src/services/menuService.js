import api from '../config/api';

export const menuService = {
  getMenu: async () => {
    try {
      console.log('Fetching menu from:', '/public/menu');
      const response = await api.get('/public/menu');
      console.log('Menu API Response Status:', response.status);
      console.log('Menu API Response:', JSON.stringify(response.data, null, 2));
      // Backend returns: { success: true, message: "...", data: [...] }
      // So we need to return response.data which contains the ApiResponse wrapper
      if (response.data && response.data.success) {
        return response.data;
      }
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Menu API Error:', error);
      console.error('Error Message:', error.message);
      console.error('Error Code:', error.code);
      console.error('Error Response Status:', error.response?.status);
      console.error('Error Response Data:', error.response?.data);
      console.error('Error Request URL:', error.config?.url);
      console.error('Error Request Base URL:', error.config?.baseURL);
      
      // Provide more helpful error messages
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        throw new Error('Cannot connect to server. Please check if the backend is running and the IP address is correct.');
      }
      if (error.response?.status === 404) {
        throw new Error('Menu endpoint not found. Please check the API URL.');
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw error;
    }
  },

  getMenuItem: async (itemId) => {
    try {
      const response = await api.get(`/public/menu/items/${itemId}`);
      // Backend returns: { success: true, message: "...", data: {...} }
      return response.data;
    } catch (error) {
      console.error('MenuItem API Error:', error);
      throw error;
    }
  },
};


