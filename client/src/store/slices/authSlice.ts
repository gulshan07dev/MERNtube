import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  isWatchHistoryPaused?: boolean;
}

interface Channel extends User {
  subscriberCount: number;
  channelSubscribedToCount: number;
  videoCount: number;
  isSubscribed: boolean;
}

interface initialState {
  isLoggedIn: boolean;
  user: User | null;
  channel: Channel | null;
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
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("isLoggedIn");
    },
    setUser: (state, action: PayloadAction<Partial<User>>) => {
      state.user = { ...state.user, ...action.payload } as User;
    },
    setChannel: (state, action: PayloadAction<Channel>) => {
      state.channel = action.payload;
    },
  },
});

export default authSlice.reducer;
export const { login, logout, setUser, setChannel } = authSlice.actions;
