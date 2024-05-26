// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import ordersReducer from './ordersSlice'; // Import the orders reducer

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    orders: ordersReducer, // Add the orders reducer
  },
});

export default store;
