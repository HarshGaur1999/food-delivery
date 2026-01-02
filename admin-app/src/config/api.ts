// API Configuration
// For Android Emulator: use 'http://10.0.2.2:8080/api/v1'
// For iOS Simulator: use 'http://localhost:8080/api/v1'
// For Physical Device: use 'http://YOUR_COMPUTER_IP:8080/api/v1'
//   To find your IP: Run 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux)
//   Look for IPv4 Address (usually starts with 192.168.x.x or 10.x.x.x)
//   Make sure your device and computer are on the same WiFi network

import { Platform } from 'react-native';

const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Physical Android Device - YOUR COMPUTER'S IP
      return 'http://10.232.134.177:8080/api/v1';
      
      // For Android Emulator, use this instead:
      // return 'http://10.0.2.2:8080/api/v1';
    } else if (Platform.OS === 'ios') {
      return 'http://localhost:8080/api/v1';
    }
  }
  return 'https://your-production-api.com/api/v1';
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 30000,
};

// Log the URL being used for debugging
console.log('🔧 [API Config] Base URL:', API_CONFIG.BASE_URL);
console.log('🔧 [API Config] Platform:', Platform.OS);
console.log('🔧 [API Config] Dev Mode:', __DEV__);

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/admin/login',
    ADMIN_OTP_SEND: '/auth/admin/otp/send',
    ADMIN_OTP_VERIFY: '/auth/admin/otp/verify',
    REFRESH_TOKEN: '/auth/refresh',
  },
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard/stats',
    SALES_REPORT: '/admin/dashboard/sales-report',
    ORDERS: '/admin/orders',
    ORDER_DETAIL: (id: number) => `/admin/orders/${id}`,
    ACCEPT_ORDER: (id: number) => `/admin/orders/${id}/accept`,
    REJECT_ORDER: (id: number) => `/admin/orders/${id}/reject`,
    UPDATE_ORDER_STATUS: (id: number) => `/admin/orders/${id}/status`,
    ASSIGN_DELIVERY: (id: number) => `/admin/orders/${id}/assign-delivery`,
    DELIVERY_BOYS: '/admin/delivery-boys',
    CATEGORIES: '/admin/menu/categories',
    CATEGORY_DETAIL: (id: number) => `/admin/menu/categories/${id}`,
    TOGGLE_CATEGORY: (id: number) => `/admin/menu/categories/${id}/toggle`,
    MENU_ITEMS: '/admin/menu/items',
    MENU_ITEM_DETAIL: (id: number) => `/admin/menu/items/${id}`,
    TOGGLE_MENU_ITEM: (id: number) => `/admin/menu/items/${id}/toggle`,
    DELIVERY_LOCATION: (orderId: number) => `/admin/orders/${orderId}/delivery-location`,
  },
};