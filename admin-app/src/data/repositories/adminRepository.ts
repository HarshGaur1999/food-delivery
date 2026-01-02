import {apiClient} from '@services/apiClient';
import {ENDPOINTS} from '@config/api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface DashboardStats {
  period: string;
  totalOrders: number;
  totalRevenue: number;
  codOrders: number;
  onlineOrders: number;
  averageOrderValue: number;
  pendingOrders: number;
  preparingOrders: number;
  totalCustomers: number;
  activeDeliveryBoys: number;
}

export interface SalesReport {
  period: string;
  startDate: string;
  endDate: string;
  totalOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  paymentMethodCount: Record<string, number>;
  paymentMethodRevenue: Record<string, number>;
  statusBreakdown: Record<string, number>;
}

export interface Order {
  id: number;
  orderNumber: string;
  customer: {
    id: number;
    fullName: string;
    mobileNumber: string;
  };
  deliveryBoy: {
    id: number;
    fullName: string;
    mobileNumber: string;
  } | null;
  status: string;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  specialInstructions: string | null;
  estimatedDeliveryTime: string | null;
  acceptedAt: string | null;
  readyAt: string | null;
  outForDeliveryAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  items: Array<{
    id: number;
    menuItem: {
      id: number;
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
}

export interface DeliveryBoy {
  id: number;
  userId: number;
  name: string;
  mobile: string;
  licenseNumber: string | null;
  vehicleNumber: string | null;
  vehicleType: string | null;
  isAvailable: boolean;
  isOnDuty: boolean;
  totalDeliveries: number;
  totalEarnings: number;
}

export interface MenuCategory {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: number;
  category: {
    id: number;
    name: string;
  };
  name: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  imageUrl: string | null;
  status: string;
  preparationTimeMinutes: number | null;
  isVegetarian: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface RejectOrderRequest {
  reason: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export interface AssignDeliveryBoyRequest {
  deliveryBoyId: number;
}

export const adminRepository = {
  async getDashboardStats(period: string = 'today'): Promise<DashboardStats> {
    const response = await apiClient.instance.get<ApiResponse<DashboardStats>>(
      ENDPOINTS.ADMIN.DASHBOARD_STATS,
      {params: {period}},
    );
    return response.data.data;
  },

  async getSalesReport(period: string = 'today'): Promise<SalesReport> {
    const response = await apiClient.instance.get<ApiResponse<SalesReport>>(
      ENDPOINTS.ADMIN.SALES_REPORT,
      {params: {period}},
    );
    return response.data.data;
  },

  async getOrders(status?: string): Promise<Order[]> {
    const response = await apiClient.instance.get<ApiResponse<Order[]>>(
      ENDPOINTS.ADMIN.ORDERS,
      {params: status ? {status} : {}},
    );
    return response.data.data;
  },

  async getOrderDetail(id: number): Promise<Order> {
    const response = await apiClient.instance.get<ApiResponse<Order>>(
      ENDPOINTS.ADMIN.ORDER_DETAIL(id),
    );
    return response.data.data;
  },

  async acceptOrder(id: number): Promise<Order> {
    const response = await apiClient.instance.post<ApiResponse<Order>>(
      ENDPOINTS.ADMIN.ACCEPT_ORDER(id),
    );
    return response.data.data;
  },

  async rejectOrder(id: number, request: RejectOrderRequest): Promise<Order> {
    const response = await apiClient.instance.post<ApiResponse<Order>>(
      ENDPOINTS.ADMIN.REJECT_ORDER(id),
      request,
    );
    return response.data.data;
  },

  async updateOrderStatus(
    id: number,
    request: UpdateOrderStatusRequest,
  ): Promise<Order> {
    const response = await apiClient.instance.put<ApiResponse<Order>>(
      ENDPOINTS.ADMIN.UPDATE_ORDER_STATUS(id),
      request,
    );
    return response.data.data;
  },

  async assignDeliveryBoy(
    id: number,
    request: AssignDeliveryBoyRequest,
  ): Promise<Order> {
    const response = await apiClient.instance.put<ApiResponse<Order>>(
      ENDPOINTS.ADMIN.ASSIGN_DELIVERY(id),
      request,
    );
    return response.data.data;
  },

  async getDeliveryBoys(): Promise<DeliveryBoy[]> {
    const response = await apiClient.instance.get<ApiResponse<DeliveryBoy[]>>(
      ENDPOINTS.ADMIN.DELIVERY_BOYS,
    );
    return response.data.data;
  },

  async getCategories(): Promise<MenuCategory[]> {
    const response = await apiClient.instance.get<ApiResponse<MenuCategory[]>>(
      ENDPOINTS.ADMIN.CATEGORIES,
    );
    return response.data.data;
  },

  async createCategory(category: Partial<MenuCategory>): Promise<MenuCategory> {
    const response = await apiClient.instance.post<ApiResponse<MenuCategory>>(
      ENDPOINTS.ADMIN.CATEGORIES,
      category,
    );
    return response.data.data;
  },

  async updateCategory(
    id: number,
    category: Partial<MenuCategory>,
  ): Promise<MenuCategory> {
    const response = await apiClient.instance.put<ApiResponse<MenuCategory>>(
      ENDPOINTS.ADMIN.CATEGORY_DETAIL(id),
      category,
    );
    return response.data.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await apiClient.instance.delete(ENDPOINTS.ADMIN.CATEGORY_DETAIL(id));
  },

  async toggleCategory(id: number): Promise<MenuCategory> {
    const response = await apiClient.instance.put<ApiResponse<MenuCategory>>(
      ENDPOINTS.ADMIN.TOGGLE_CATEGORY(id),
    );
    return response.data.data;
  },

  async getMenuItems(): Promise<MenuItem[]> {
    const response = await apiClient.instance.get<ApiResponse<MenuItem[]>>(
      ENDPOINTS.ADMIN.MENU_ITEMS,
    );
    return response.data.data;
  },

  async createMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    const response = await apiClient.instance.post<ApiResponse<MenuItem>>(
      ENDPOINTS.ADMIN.MENU_ITEMS,
      item,
    );
    return response.data.data;
  },

  async updateMenuItem(id: number, item: Partial<MenuItem>): Promise<MenuItem> {
    const response = await apiClient.instance.put<ApiResponse<MenuItem>>(
      ENDPOINTS.ADMIN.MENU_ITEM_DETAIL(id),
      item,
    );
    return response.data.data;
  },

  async deleteMenuItem(id: number): Promise<void> {
    await apiClient.instance.delete(ENDPOINTS.ADMIN.MENU_ITEM_DETAIL(id));
  },

  async toggleMenuItem(id: number): Promise<MenuItem> {
    const response = await apiClient.instance.put<ApiResponse<MenuItem>>(
      ENDPOINTS.ADMIN.TOGGLE_MENU_ITEM(id),
    );
    return response.data.data;
  },

  async getDeliveryLocation(orderId: number): Promise<{
    latitude: number;
    longitude: number;
    timestamp: string;
    deliveryAddress: string;
    deliveryLatitude: number;
    deliveryLongitude: number;
    deliveryBoy: {
      id: number;
      name: string;
      mobile: string;
    };
  }> {
    const response = await apiClient.instance.get<ApiResponse<any>>(
      ENDPOINTS.ADMIN.DELIVERY_LOCATION(orderId),
    );
    return response.data.data;
  },
};






