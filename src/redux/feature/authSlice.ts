import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

// export type TUser = {
//   jti: string;
//   token_type: string;
//   exp: number;
//   iat: number;
//   user_id: number;
//   username: string;
//   email: string;
// };
export type TUser = {
  jti: string;
  token_type: string;
  exp: number;
  iat: number;
  user_id: number;
  username: string;
  email: string;
};

type TAuthState = {
  user: null | TUser;
  token: null | string;
};
const initialState: TAuthState = {
  user: null,
  token: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});
export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
export const useCurrentToken = (state: RootState) => state.auth.token;
export const useCurrentUser = (state: RootState) => state.auth.user;
