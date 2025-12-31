/**
 * Application Constants
 */

export const APP_CONSTANTS = {
  // Location
  LOCATION_UPDATE_INTERVAL: 10000, // 10 seconds
  LOCATION_ACCURACY: {
    HIGH: {accuracy: 1, distanceFilter: 10},
    MEDIUM: {accuracy: 5, distanceFilter: 50},
    LOW: {accuracy: 10, distanceFilter: 100},
  },
  
  // Order Status
  ORDER_STATUS: {
    READY: 'READY',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
  },
  
  // Payment
  PAYMENT_METHOD: {
    COD: 'COD',
    ONLINE: 'ONLINE',
  },
  
  // Storage Keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: '@access_token',
    REFRESH_TOKEN: '@refresh_token',
    USER_PROFILE: '@user_profile',
    FCM_TOKEN: '@fcm_token',
  },
  
  // Token Refresh
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
};









