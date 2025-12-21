/**
 * Order Store (Zustand)
 */

import {create} from 'zustand';
import {Order, OrderStatus} from '@domain/models/Order';

interface OrderState {
  assignedOrder: Order | null;
  availableOrders: Order[];
  myOrders: Order[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setAssignedOrder: (order: Order | null) => void;
  setAvailableOrders: (orders: Order[]) => void;
  setMyOrders: (orders: Order[]) => void;
  acceptOrder: (order: Order) => void;
  updateOrderStatus: (orderId: number, status: OrderStatus) => void;
  clearAssignedOrder: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const orderStore = create<OrderState>((set) => ({
  assignedOrder: null,
  availableOrders: [],
  myOrders: [],
  isLoading: false,
  error: null,

  setAssignedOrder: (order) => {
    set({assignedOrder: order});
  },

  setAvailableOrders: (orders) => {
    set({availableOrders: orders});
  },

  setMyOrders: (orders) => {
    set({myOrders: orders});
  },

  acceptOrder: (order) => {
    set((state) => ({
      assignedOrder: order,
      availableOrders: state.availableOrders.filter((o) => o.id !== order.id),
    }));
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => {
      const updateOrder = (o: Order) =>
        o.id === orderId ? {...o, status} : o;

      return {
        assignedOrder: state.assignedOrder
          ? updateOrder(state.assignedOrder)
          : null,
        myOrders: state.myOrders.map(updateOrder),
      };
    });
  },

  clearAssignedOrder: () => {
    set({assignedOrder: null});
  },

  setLoading: (loading) => {
    set({isLoading: loading});
  },

  setError: (error) => {
    set({error});
  },
}));


