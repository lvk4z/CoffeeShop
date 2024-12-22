import { configureStore } from '@reduxjs/toolkit';
import ordersSlice from '../features/ordersSlice';
import userSlice from '../features/userSlice';

export const store = configureStore({
    reducer: {
        //orders: ordersSlice,
        user: userSlice,
    },
});
