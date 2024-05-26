import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
  },
  reducers: {
    signIn(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    signOut(state) {
      state.user = null;
      state.token = null;
    },
    updateUser(state, action) {
      if (state.user) {
        state.user.name = action.payload.name;
      }
    },
  },
});

export const { signIn, signOut, updateUser } = authSlice.actions;
export default authSlice.reducer;
