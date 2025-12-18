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
      const response = await menuService.getMenu();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch menu');
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
        state.categories = action.payload;
        // Flatten items from all categories
        state.items = action.payload.flatMap(category => category.items || []);
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default menuSlice.reducer;







