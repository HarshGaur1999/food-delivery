/**
 * Location Store (Zustand)
 */

import {create} from 'zustand';
import {Location} from '@domain/models/Location';

interface LocationState {
  currentLocation: Location | null;
  isTracking: boolean;
  trackingOrderId: number | null;
  error: string | null;

  // Actions
  setCurrentLocation: (location: Location) => void;
  startTracking: (orderId: number) => void;
  stopTracking: () => void;
  setError: (error: string | null) => void;
}

export const locationStore = create<LocationState>((set) => ({
  currentLocation: null,
  isTracking: false,
  trackingOrderId: null,
  error: null,

  setCurrentLocation: (location) => {
    set({currentLocation: location});
  },

  startTracking: (orderId) => {
    set({isTracking: true, trackingOrderId: orderId});
  },

  stopTracking: () => {
    set({isTracking: false, trackingOrderId: null});
  },

  setError: (error) => {
    set({error});
  },
}));











