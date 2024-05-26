import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch only the logged-in user's orders
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (token, { getState }) => {
  const response = await fetch('http://192.168.1.23:3000/orders/all', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Network response was not ok');
  }
  const data = await response.json();

  // Ensure data structure is correct
  if (!data.orders) {
    throw new Error('Invalid orders data');
  }

  // Parse the order_items field in each order
  const parsedOrders = data.orders.map(order => {
    let parsedItems;
    try {
      parsedItems = JSON.parse(order.order_items);
    } catch (e) {
      console.error('Error parsing order items:', e);
      parsedItems = [];
    }
    return { ...order, order_items: parsedItems };
  });

  return parsedOrders;
});

export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async ({ orderId, isPaid, isDelivered }, { getState }) => {
  const token = getState().auth.token;
  const response = await fetch(`http://192.168.1.23:3000/orders/updateorder`, {
    method: 'POST', // Assuming POST based on your provided cURL
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      orderID: orderId,
      isPaid,
      isDelivered
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Network response was not ok');
  }
  const data = await response.json();
  return { orderId, isPaid, isDelivered, ...data };
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const order = state.orders.find((order) => order.id === action.payload.orderId);
        if (order) {
          order.is_paid = action.payload.isPaid;
          order.is_delivered = action.payload.isDelivered;
        }
      });
  },
});

export const { addOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
