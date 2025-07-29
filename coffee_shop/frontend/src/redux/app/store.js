import { configureStore } from '@reduxjs/toolkit';
import meetingSlice from '../features/meetingSlice';
import authReducer from '../features/authSlice';

export const store = configureStore({
    reducer: {
        //orders: ordersSlice,
        meeting: meetingSlice,
        auth: authReducer,
    },
});
