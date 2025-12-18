import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {menuService} from '../../services/menuService';

const initialState = {
  categories: [],
  items: [],
  isLoading: false,
  error: null,
};

export const fetchMenu = createAsyncThunk(
  'menu/fetchMenu',
  async (_, {rejectWithValue}) => {
    try {
      console.log('fetchMenu thunk: Starting menu fetch...');
      const response = await menuService.getMenu();
      console.log('fetchMenu thunk: Menu Service Response:', response);
      // Backend returns: { success: true, message: "...", data: [...] }
      // So response.data contains the actual menu categories array
      if (response && response.success && response.data) {
        console.log('fetchMenu thunk: Menu data extracted successfully, categories count:', response.data.length);
        return response.data;
      }
      // Fallback if structure is different
      if (response && Array.isArray(response)) {
        console.log('fetchMenu thunk: Response is array, returning as is');
        return response;
      }
      console.warn('fetchMenu thunk: Unexpected response structure:', response);
      return [];
    } catch (error) {
      console.error('fetchMenu thunk: Error caught:', error);
      console.error('fetchMenu thunk: Error message:', error.message);
      const errorMessage = error.message || error.response?.data?.message || 'Failed to fetch menu';
      console.error('fetchMenu thunk: Returning error message:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMenu.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure categories is always an array to prevent FlatList errors
        state.categories = Array.isArray(action.payload) ? action.payload : [];
        // Flatten items from all categories
        state.items = Array.isArray(action.payload) 
          ? action.payload.flatMap(category => category.items || [])
          : [];
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default menuSlice.reducer;


