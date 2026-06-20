import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const authenticateUser = createAsyncThunk(
    'auth/authenticate',
    async ({ username, house = 'Z' }, { rejectWithValue }) => {
        try {
            const res = await axios.post('/api/auth/', { username, house });
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.detail || 'Błąd logowania');
        }
    }
);

export const checkAuthStatus = createAsyncThunk(
    'auth/checkStatus',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('access');
        if (!token) return rejectWithValue('No token');
        try {
            const res = await axios.get('/api/user-in-base/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { access: token, user: res.data };
        } catch {
            // Try refreshing
            const refresh = localStorage.getItem('refresh');
            if (!refresh) return rejectWithValue('No refresh token');
            const r = await axios.post('/api/token/refresh/', { refresh });
            localStorage.setItem('access', r.data.access);
            const res2 = await axios.get('/api/user-in-base/', {
                headers: { Authorization: `Bearer ${r.data.access}` },
            });
            return { access: r.data.access, user: res2.data };
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        access: localStorage.getItem('access'),
        refresh: localStorage.getItem('refresh'),
        username: localStorage.getItem('username'),
        user: null,
        isAuthenticated: !!localStorage.getItem('access'),
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('username');
            state.access = null;
            state.refresh = null;
            state.username = null;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        tokenRefreshed: (state, action) => {
            state.access = action.payload.access;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(authenticateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.access = action.payload.access;
                state.refresh = action.payload.refresh;
                state.username = action.payload.username;
                state.user = { username: action.payload.username, house: action.payload.house };
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(authenticateUser.rejected, (state, action) => {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                state.loading = false;
                state.access = null;
                state.refresh = null;
                state.username = null;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || action.error.message || 'Błąd logowania';
            })
            .addCase(checkAuthStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.access = action.payload.access;
                state.username = action.payload.user.username;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                localStorage.removeItem('username');
                state.loading = false;
                state.access = null;
                state.refresh = null;
                state.username = null;
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { logout, clearError, tokenRefreshed } = authSlice.actions;
export default authSlice.reducer;
