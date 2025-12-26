import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@cart_items';

const initialState = {
  items: [],
  total: 0,
};

const calculateTotal = items => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const {menuItem, quantity, specialInstructions} = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.menuItemId === menuItem.id && 
        item.specialInstructions === (specialInstructions || '')
      );

      if (existingItemIndex >= 0) {
        // Update existing item with same instructions
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        state.items.push({
          menuItemId: menuItem.id,
          id: menuItem.id, // Keep for backward compatibility
          name: menuItem.name,
          price: parseFloat(menuItem.price),
          imageUrl: menuItem.imageUrl,
          quantity,
          specialInstructions: specialInstructions || '',
        });
      }

      state.total = calculateTotal(state.items);
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = calculateTotal(state.items);
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const {itemId, quantity} = action.payload;
      const item = state.items.find(item => item.id === itemId || item.menuItemId === itemId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => 
            item.id !== itemId && item.menuItemId !== itemId
          );
        } else {
          item.quantity = quantity;
        }
        state.total = calculateTotal(state.items);
        AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      }
    },
    updateItemInstructions: (state, action) => {
      const {itemId, specialInstructions} = action.payload;
      const item = state.items.find(item => item.id === itemId || item.menuItemId === itemId);
      if (item) {
        item.specialInstructions = specialInstructions || '';
        AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      }
    },
    clearCart: state => {
      state.items = [];
      state.total = 0;
      AsyncStorage.removeItem(CART_STORAGE_KEY);
    },
    loadCart: (state, action) => {
      state.items = action.payload || [];
      state.total = calculateTotal(state.items);
    },
  },
});

export const {addToCart, removeFromCart, updateQuantity, updateItemInstructions, clearCart, loadCart} =
  cartSlice.actions;
export default cartSlice.reducer;


