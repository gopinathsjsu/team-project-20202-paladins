import {createSlice} from '@reduxjs/toolkit';


const initialState = {
    token: localStorage.getItem('token') || null,
    email: localStorage.getItem('email') || null,
    role: localStorage.getItem('role') || null,
    isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            const {token, email, role} = action.payload;
            state.token = token;
            state.email = email;
            state.role = role;
            state.isAuthenticated = true;

            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            localStorage.setItem('role', role);
        },
        logout: (state) => {
            state.token = null;
            state.email = null;
            state.role = null;
            state.isAuthenticated = false;

            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('role');
        },
    },
});


export const {login, logout} = authSlice.actions;
export default authSlice.reducer;
