/**
 * Earnings Store (Zustand)
 */

import {create} from 'zustand';

interface Earnings {
  today: number;
  total: number;
}

interface EarningsState {
  earnings: Earnings;
  isLoading: boolean;
  error: string | null;

  // Actions
  setEarnings: (earnings: Earnings) => void;
  updateTodayEarnings: (amount: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const earningsStore = create<EarningsState>((set) => ({
  earnings: {
    today: 0,
    total: 0,
  },
  isLoading: false,
  error: null,

  setEarnings: (earnings) => {
    set({earnings});
  },

  updateTodayEarnings: (amount) => {
    set((state) => ({
      earnings: {
        ...state.earnings,
        today: state.earnings.today + amount,
        total: state.earnings.total + amount,
      },
    }));
  },

  setLoading: (loading) => {
    set({isLoading: loading});
  },

  setError: (error) => {
    set({error});
  },
}));











