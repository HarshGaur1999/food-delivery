import api from '../config/api';

// Dashboard
export const getDashboardStats = async (period = 'today') => {
  const response = await api.get(`/admin/dashboard/stats?period=${period}`);
  return response.data.data;
};

export const getSalesReport = async (period = 'today') => {
  const response = await api.get(`/admin/dashboard/sales-report?period=${period}`);
  return response.data.data;
};

// Orders
export const getAllOrders = async (status = null) => {
  const url = status ? `/admin/orders?status=${status}` : '/admin/orders';
  const response = await api.get(url);
  return response.data.data;
};

export const getOrderDetails = async (orderId) => {
  const response = await api.get(`/admin/orders/${orderId}`);
  return response.data.data;
};

export const acceptOrder = async (orderId) => {
  const response = await api.post(`/admin/orders/${orderId}/accept`);
  return response.data.data;
};

export const rejectOrder = async (orderId, reason) => {
  const response = await api.post(`/admin/orders/${orderId}/reject`, { reason });
  return response.data.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/admin/orders/${orderId}/status`, { status });
  return response.data.data;
};

export const assignDeliveryBoy = async (orderId, deliveryBoyId) => {
  const response = await api.put(`/admin/orders/${orderId}/assign-delivery`, {
    deliveryBoyId,
  });
  return response.data.data;
};

// Menu Categories
export const getCategories = async () => {
  const response = await api.get('/admin/menu/categories');
  return response.data.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/admin/menu/categories', categoryData);
  return response.data.data;
};

export const updateCategory = async (categoryId, categoryData) => {
  const response = await api.put(`/admin/menu/categories/${categoryId}`, categoryData);
  return response.data.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/admin/menu/categories/${categoryId}`);
  return response.data;
};

export const toggleCategory = async (categoryId) => {
  const response = await api.put(`/admin/menu/categories/${categoryId}/toggle`);
  return response.data.data;
};

// Menu Items
export const getMenuItems = async () => {
  const response = await api.get('/admin/menu/items');
  return response.data.data;
};

export const createMenuItem = async (itemData) => {
  const response = await api.post('/admin/menu/items', itemData);
  return response.data.data;
};

export const updateMenuItem = async (itemId, itemData) => {
  const response = await api.put(`/admin/menu/items/${itemId}`, itemData);
  return response.data.data;
};

export const deleteMenuItem = async (itemId) => {
  const response = await api.delete(`/admin/menu/items/${itemId}`);
  return response.data;
};

export const toggleMenuItem = async (itemId) => {
  const response = await api.put(`/admin/menu/items/${itemId}/toggle`);
  return response.data.data;
};

// Delivery Boys
export const getDeliveryBoys = async () => {
  const response = await api.get('/admin/delivery-boys');
  return response.data.data;
};












