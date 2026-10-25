import { createSlice } from '@reduxjs/toolkit';
import { saveSessionToStorage, clearSessionFromStorage } from './asyncStorage';

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      saveSessionToStorage(action.payload);
    },
    loginFailure: (state, action) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      clearSessionFromStorage();
    },
    restoreSession: (state, action) => {
      if (action.payload) {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      } else {
        state.currentUser = null;
        state.isAuthenticated = false;
      }
      state.isLoading = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAuthLoading,
  loginSuccess,
  loginFailure,
  logout,
  restoreSession,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
