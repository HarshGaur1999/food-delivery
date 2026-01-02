import {create} from 'zustand';
import {adminRepository, Order} from '@data/repositories/adminRepository';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  fetchOrders: (status?: string) => Promise<void>;
  fetchOrderDetail: (id: number) => Promise<void>;
  acceptOrder: (id: number) => Promise<void>;
  rejectOrder: (id: number, reason: string) => Promise<void>;
  updateOrderStatus: (id: number, status: string) => Promise<void>;
  assignDeliveryBoy: (id: number, deliveryBoyId: number) => Promise<void>;
  clearError: () => void;
}

export const orderStore = create<OrderState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async (status?: string) => {
    set({isLoading: true, error: null});
    try {
      const orders = await adminRepository.getOrders(status);
      set({orders, isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch orders',
        isLoading: false,
      });
    }
  },

  fetchOrderDetail: async (id: number) => {
    set({isLoading: true, error: null});
    try {
      const order = await adminRepository.getOrderDetail(id);
      set({selectedOrder: order, isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch order',
        isLoading: false,
      });
    }
  },

  acceptOrder: async (id: number) => {
    set({isLoading: true, error: null});
    try {
      await adminRepository.acceptOrder(id);
      await get().fetchOrders();
      await get().fetchOrderDetail(id);
      set({isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to accept order',
        isLoading: false,
      });
      throw error;
    }
  },

  rejectOrder: async (id: number, reason: string) => {
    set({isLoading: true, error: null});
    try {
      await adminRepository.rejectOrder(id, {reason});
      await get().fetchOrders();
      set({isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to reject order',
        isLoading: false,
      });
      throw error;
    }
  },

  updateOrderStatus: async (id: number, status: string) => {
    set({isLoading: true, error: null});
    try {
      await adminRepository.updateOrderStatus(id, {status});
      await get().fetchOrders();
      await get().fetchOrderDetail(id);
      set({isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to update order status',
        isLoading: false,
      });
      throw error;
    }
  },

  assignDeliveryBoy: async (id: number, deliveryBoyId: number) => {
    set({isLoading: true, error: null});
    try {
      await adminRepository.assignDeliveryBoy(id, {deliveryBoyId});
      await get().fetchOrders();
      await get().fetchOrderDetail(id);
      set({isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to assign delivery boy',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({error: null});
  },
}));







