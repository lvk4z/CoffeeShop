import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Prostsza wersja akcji autentykacji
export const authenticateUser = createAsyncThunk(
    'auth/authenticate', 
    async ({ username, house = 'Z' }) => {
        const res = await axios.post('/api/auth/', { 
            username,  
            house
        });
        
        // Zapisz dane do localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        
        return res.data;
    }
);

// Prostsza wersja sprawdzania statusu
export const checkAuthStatus = createAsyncThunk(
    'auth/checkStatus',
    async () => {
        const token = localStorage.getItem('access');
        if (!token) {
            throw new Error('No token found');
        }
        
        const res = await axios.get('/api/user-in-base/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        return {
            access: token,
            username: res.data.username,
            house: res.data.house,
            user: res.data
        };
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
        }
    },
    extraReducers: (builder) => {
        builder
            // authenticateUser cases
            .addCase(authenticateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.access = action.payload.access;
                state.refresh = action.payload.refresh;
                state.username = action.payload.username;
                state.user = {
                    username: action.payload.username,
                    coffee_group: action.payload.house || 'Z'
                };
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
                state.error = action.error.message || 'Authentication failed';
            })
            .addCase(checkAuthStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.access = action.payload.access;
                state.username = action.payload.username;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
                console.log("User authenticated:", action.payload.username);
            })
            .addCase(checkAuthStatus.rejected, (state, action) => {
                // Wyczyść localStorage przy błędzie
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                localStorage.removeItem('username');

                state.loading = false;
                state.access = null;
                state.refresh = null;
                state.username = null;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.error.message || 'Token invalid';
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;