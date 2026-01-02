import {create} from 'zustand';
import {adminRepository, DeliveryBoy} from '@data/repositories/adminRepository';

interface DeliveryState {
  deliveryBoys: DeliveryBoy[];
  isLoading: boolean;
  error: string | null;
  fetchDeliveryBoys: () => Promise<void>;
  clearError: () => void;
}

export const deliveryStore = create<DeliveryState>((set, get) => ({
  deliveryBoys: [],
  isLoading: false,
  error: null,

  fetchDeliveryBoys: async () => {
    set({isLoading: true, error: null});
    try {
      const deliveryBoys = await adminRepository.getDeliveryBoys();
      set({deliveryBoys, isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch delivery boys',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({error: null});
  },
}));







