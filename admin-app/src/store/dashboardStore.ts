import {create} from 'zustand';
import {
  adminRepository,
  DashboardStats,
  SalesReport,
} from '@data/repositories/adminRepository';

interface DashboardState {
  stats: DashboardStats | null;
  salesReport: SalesReport | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: (period?: string) => Promise<void>;
  fetchSalesReport: (period?: string) => Promise<void>;
  clearError: () => void;
}

export const dashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  salesReport: null,
  isLoading: false,
  error: null,

  fetchStats: async (period: string = 'today') => {
    set({isLoading: true, error: null});
    try {
      const stats = await adminRepository.getDashboardStats(period);
      set({stats, isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch stats',
        isLoading: false,
      });
    }
  },

  fetchSalesReport: async (period: string = 'today') => {
    set({isLoading: true, error: null});
    try {
      const report = await adminRepository.getSalesReport(period);
      set({salesReport: report, isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch sales report',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({error: null});
  },
}));







