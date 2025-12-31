export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://10.0.2.2:8080/api/v1'
    : 'https://your-production-api.com/api/v1',
  TIMEOUT: 30000,
};

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
  },
};





