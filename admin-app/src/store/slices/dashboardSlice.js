import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (period, {rejectWithValue}) => {
    try {
      return await adminService.getDashboardStats(period);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard stats'
      );
    }
  }
);

export const fetchSalesReport = createAsyncThunk(
  'dashboard/fetchSalesReport',
  async (period, {rejectWithValue}) => {
    try {
      return await adminService.getSalesReport(period);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch sales report'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    salesReport: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSalesReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesReport = action.payload;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {clearError} = dashboardSlice.actions;
export default dashboardSlice.reducer;












