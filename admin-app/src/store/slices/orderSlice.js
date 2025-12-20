import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (status, {rejectWithValue}) => {
    try {
      return await adminService.getAllOrders(status);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (orderId, {rejectWithValue}) => {
    try {
      return await adminService.getOrderDetails(orderId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order details'
      );
    }
  }
);

export const acceptOrder = createAsyncThunk(
  'orders/acceptOrder',
  async (orderId, {rejectWithValue}) => {
    try {
      return await adminService.acceptOrder(orderId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to accept order'
      );
    }
  }
);

export const rejectOrder = createAsyncThunk(
  'orders/rejectOrder',
  async ({orderId, reason}, {rejectWithValue}) => {
    try {
      return await adminService.rejectOrder(orderId, reason);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reject order'
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({orderId, status}, {rejectWithValue}) => {
    try {
      return await adminService.updateOrderStatus(orderId, status);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update order status'
      );
    }
  }
);

export const assignDeliveryBoy = createAsyncThunk(
  'orders/assignDeliveryBoy',
  async ({orderId, deliveryBoyId}, {rejectWithValue}) => {
    try {
      return await adminService.assignDeliveryBoy(orderId, deliveryBoyId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to assign delivery boy'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch order details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Accept order
      .addCase(acceptOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      // Reject order
      .addCase(rejectOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      // Assign delivery boy
      .addCase(assignDeliveryBoy.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      });
  },
});

export const {clearError, clearCurrentOrder} = orderSlice.actions;
export default orderSlice.reducer;




