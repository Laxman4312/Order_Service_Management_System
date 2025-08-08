// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

import { clearAllCookies, getCookieState } from 'utils/cookie-utils';

const initialState = {
  isAuthenticated: getCookieState('isAuthenticated') || false,
  userData: getCookieState('userData') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      clearAllCookies();
      state.isAuthenticated = false;
      state.userData = null;
    },
    rehydrateAuth: (state) => {
      state.isAuthenticated = getCookieState('isAuthenticated');
      state.userData = getCookieState('userData');
    },
  },
});

export const { logout, rehydrateAuth } = authSlice.actions;
export default authSlice.reducer;
