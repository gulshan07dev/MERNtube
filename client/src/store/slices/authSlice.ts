import { IChannel, IUser } from "@/interfaces";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface initialState {
  isLoggedIn: boolean;
  user: IUser | null;
  channel: IChannel | null;
}

const initialState: initialState = {
  isLoggedIn: Boolean(localStorage.getItem("isLoggedIn") || false),
  user: null,
  channel: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("isLoggedIn");
    },
    setUser: (state, action: PayloadAction<Partial<IUser>>) => {
      state.user = { ...state.user, ...action.payload } as IUser;
    },
    setChannel: (state, action: PayloadAction<IChannel>) => {
      state.channel = action.payload;
    },
  },
});

export default authSlice.reducer;
export const { login, logout, setUser, setChannel } = authSlice.actions;
