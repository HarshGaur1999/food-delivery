/**
 * API Configuration
 * Update BASE_URL with your backend server URL
 */

export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://10.0.2.2:8080/api/v1' // Android emulator - change to your local IP for physical device
    : 'https://your-production-api.com/api/v1',
  TIMEOUT: 30000,
};

export const ENDPOINTS = {
  // Auth
  AUTH: {
    SEND_OTP: '/auth/otp/send',
    VERIFY_OTP: '/auth/otp/verify/delivery',
    REFRESH_TOKEN: '/auth/refresh',
  },
  // Delivery
  DELIVERY: {
    AVAILABLE_ORDERS: '/delivery/orders/available',
    ACCEPT_ORDER: (orderId: number) => `/delivery/orders/${orderId}/accept`,
    UPDATE_LOCATION: (orderId: number) => `/delivery/orders/${orderId}/update-location`,
    DELIVER_ORDER: (orderId: number) => `/delivery/orders/${orderId}/deliver`,
    MY_ORDERS: '/delivery/orders/my-orders',
    UPDATE_STATUS: '/delivery/status',
    UPDATE_FCM_TOKEN: '/delivery/fcm-token',
  },
};

