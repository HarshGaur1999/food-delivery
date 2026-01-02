/**
 * Delivery Repository
 */

import {apiClient} from '@data/api/apiClient';
import {ENDPOINTS} from '@config/api';

export const deliveryRepository = {
  updateStatus: async (isAvailable: boolean, isOnDuty: boolean): Promise<{
    isAvailable: boolean;
    isOnDuty: boolean;
  }> => {
    return apiClient.put(ENDPOINTS.DELIVERY.UPDATE_STATUS, null, {
      params: {
        isAvailable,
        isOnDuty,
      },
    });
  },

  updateFcmToken: async (fcmToken: string): Promise<void> => {
    return apiClient.put(ENDPOINTS.DELIVERY.UPDATE_FCM_TOKEN, null, {
      params: {
        fcmToken,
      },
    });
  },
};











