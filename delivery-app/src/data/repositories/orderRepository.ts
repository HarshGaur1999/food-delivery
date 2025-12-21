/**
 * Order Repository
 */

import {apiClient} from '@data/api/apiClient';
import {ENDPOINTS} from '@config/api';
import {Order} from '@domain/models/Order';

export const orderRepository = {
  getAvailableOrders: async (): Promise<Order[]> => {
    return apiClient.get(ENDPOINTS.DELIVERY.AVAILABLE_ORDERS);
  },

  acceptOrder: async (orderId: number): Promise<Order> => {
    return apiClient.post(ENDPOINTS.DELIVERY.ACCEPT_ORDER(orderId));
  },

  updateLocation: async (
    orderId: number,
    latitude: number,
    longitude: number,
    address?: string,
  ): Promise<void> => {
    return apiClient.post(
      ENDPOINTS.DELIVERY.UPDATE_LOCATION(orderId),
      null,
      {
        params: {
          latitude,
          longitude,
          ...(address && {address}),
        },
      },
    );
  },

  deliverOrder: async (orderId: number): Promise<Order> => {
    return apiClient.post(ENDPOINTS.DELIVERY.DELIVER_ORDER(orderId));
  },

  getMyOrders: async (): Promise<Order[]> => {
    return apiClient.get(ENDPOINTS.DELIVERY.MY_ORDERS);
  },
};

