import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';

export const fetchDeliveryBoys = createAsyncThunk(
  'delivery/fetchDeliveryBoys',
  async (_, {rejectWithValue}) => {
    try {
      return await adminService.getDeliveryBoys();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch delivery boys'
      );
    }
  }
);

const deliverySlice = createSlice({
  name: 'delivery',
  initialState: {
    deliveryBoys: [],
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
      .addCase(fetchDeliveryBoys.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryBoys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deliveryBoys = action.payload;
      })
      .addCase(fetchDeliveryBoys.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {clearError} = deliverySlice.actions;
export default deliverySlice.reducer;












