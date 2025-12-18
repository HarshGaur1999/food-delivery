import api from '../config/api';

export const menuService = {
  getMenu: async () => {
    const response = await api.get('/public/menu');
    return response.data;
  },

  getMenuItem: async (itemId) => {
    const response = await api.get(`/public/menu/items/${itemId}`);
    return response.data;
  },
};







