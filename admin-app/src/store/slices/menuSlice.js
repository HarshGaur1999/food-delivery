import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';

export const fetchCategories = createAsyncThunk(
  'menu/fetchCategories',
  async (_, {rejectWithValue}) => {
    try {
      return await adminService.getCategories();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories'
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  'menu/createCategory',
  async (categoryData, {rejectWithValue}) => {
    try {
      return await adminService.createCategory(categoryData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create category'
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  'menu/updateCategory',
  async ({categoryId, categoryData}, {rejectWithValue}) => {
    try {
      return await adminService.updateCategory(categoryId, categoryData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update category'
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'menu/deleteCategory',
  async (categoryId, {rejectWithValue}) => {
    try {
      await adminService.deleteCategory(categoryId);
      return categoryId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete category'
      );
    }
  }
);

export const toggleCategory = createAsyncThunk(
  'menu/toggleCategory',
  async (categoryId, {rejectWithValue}) => {
    try {
      return await adminService.toggleCategory(categoryId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to toggle category'
      );
    }
  }
);

export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async (_, {rejectWithValue}) => {
    try {
      return await adminService.getMenuItems();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch menu items'
      );
    }
  }
);

export const createMenuItem = createAsyncThunk(
  'menu/createMenuItem',
  async (itemData, {rejectWithValue}) => {
    try {
      return await adminService.createMenuItem(itemData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create menu item'
      );
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  'menu/updateMenuItem',
  async ({itemId, itemData}, {rejectWithValue}) => {
    try {
      return await adminService.updateMenuItem(itemId, itemData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update menu item'
      );
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  'menu/deleteMenuItem',
  async (itemId, {rejectWithValue}) => {
    try {
      await adminService.deleteMenuItem(itemId);
      return itemId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete menu item'
      );
    }
  }
);

export const toggleMenuItem = createAsyncThunk(
  'menu/toggleMenuItem',
  async (itemId, {rejectWithValue}) => {
    try {
      return await adminService.toggleMenuItem(itemId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to toggle menu item'
      );
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    categories: [],
    items: [],
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
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload);
      })
      .addCase(toggleCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      // Menu Items
      .addCase(fetchMenuItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      })
      .addCase(toggleMenuItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const {clearError} = menuSlice.actions;
export default menuSlice.reducer;




