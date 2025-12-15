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
      const existingItem = state.items.find(item => item.id === menuItem.id);

      if (existingItem) {
        existingItem.quantity += quantity;
        if (specialInstructions) {
          existingItem.specialInstructions = specialInstructions;
        }
      } else {
        state.items.push({
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
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
      const item = state.items.find(item => item.id === itemId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== itemId);
        } else {
          item.quantity = quantity;
        }
        state.total = calculateTotal(state.items);
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

export const {addToCart, removeFromCart, updateQuantity, clearCart, loadCart} =
  cartSlice.actions;
export default cartSlice.reducer;


