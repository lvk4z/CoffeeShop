import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
    status: 'idle',
    error: null
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            state.orders.push(action.payload);
        },
        removeOrder: (state, action) => {
            state.orders = state.orders.filter(order => order.id !== action.payload);
        },
        updateOrderStatus: (state, action) => {
            const { id, status } = action.payload;
            const existingOrder = state.orders.find(order => order.id === id);
            if (existingOrder) {
                existingOrder.status = status;
            }
        }
    }
});

export const { addOrder, removeOrder, updateOrderStatus } = ordersSlice.actions;

export default ordersSlice.reducer;