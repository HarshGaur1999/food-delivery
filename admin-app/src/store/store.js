import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import menuReducer from './slices/menuSlice';
import dashboardReducer from './slices/dashboardSlice';
import deliveryReducer from './slices/deliverySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
    menu: menuReducer,
    dashboard: dashboardReducer,
    delivery: deliveryReducer,
  },
});




