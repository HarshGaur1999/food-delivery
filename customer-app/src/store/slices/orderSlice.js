import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {orderService} from '../../services/orderService';

const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData, {rejectWithValue}) => {
    try {
      const response = await orderService.placeOrder(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to place order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'order/fetchMyOrders',
  async (_, {rejectWithValue}) => {
    try {
      const response = await orderService.getMyOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: state => {
      state.currentOrder = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(placeOrder.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  },
});

export const {setCurrentOrder, clearCurrentOrder} = orderSlice.actions;
export default orderSlice.reducer;







