import { createSlice } from '@reduxjs/toolkit';
import { saveUsersToStorage } from './asyncStorage';

const initialState = {
  users: [],
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.unshift(action.payload);
      saveUsersToStorage(state.users);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
        saveUsersToStorage(state.users);
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
      saveUsersToStorage(state.users);
    },
  },
});

export const { setUsers, addUser, updateUser, deleteUser } = usersSlice.actions;

export default usersSlice.reducer;
