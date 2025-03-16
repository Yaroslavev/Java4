import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null,
        username: localStorage.getItem('username') || null,
    },
    reducers: {
        setToken: (state, action) => {
            const { token, username } = action.payload;
            state.token = token;
            state.username = username;
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
        },
        clearToken: (state) => {
            state.token = null;
            state.username = null;
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        },
    },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;