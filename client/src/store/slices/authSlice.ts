import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";

export interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  avatar?: { key: string; url: string };
  coverImage?: { key: string; url: string };
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

const registerUser = createAsyncThunk(
  "/users/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/users/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const loginUser = createAsyncThunk(
  "/users/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/users/login", data);
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const logoutUser = createAsyncThunk(
  "/users/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/users/logout");
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const refreshAccessToken = createAsyncThunk(
  "/users/refresh-token",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/users/refresh-token");
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const changeUserPassword = createAsyncThunk(
  "/users/change-password",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch("/users/change-password", data);
      console.log(res);
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const changeAccountDetails = createAsyncThunk(
  "/users/change-account",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch("/users/change-account", data);
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const changeUserAvatar = createAsyncThunk(
  "/users/change-avatar",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch("/users/change-avatar", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const changeCoverImage = createAsyncThunk(
  "/users/change-coverImage",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch("/users/change-coverImage", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const getCurrentUser = createAsyncThunk(
  "/users/current-user",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/users/current-user");
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const getChannel = createAsyncThunk(
  "/users/c/username",
  async (username, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/users/c/${username}`);
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload?.data?.user;
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("isLoggedIn");
    });

    builder.addCase(changeAccountDetails.fulfilled, (state, action) => {
      state.user = action.payload?.data?.user;
    });

    builder.addCase(changeUserAvatar.fulfilled, (state, action) => {
      state.user = action.payload?.data?.user;
    });

    builder.addCase(changeCoverImage.fulfilled, (state, action) => {
      state.user = action.payload?.data?.user;
    });

    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload?.data?.user;
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
    });

    builder.addCase(getCurrentUser.rejected, (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("isLoggedIn");
    });

    builder.addCase(getChannel.pending, (state) => {
      state.channel = null;
    });

    builder.addCase(getChannel.fulfilled, (state, action) => {
      state.channel = action.payload?.data?.channel;
    });
  },
});

export default authSlice.reducer;
export const {} = authSlice.actions;
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeUserPassword,
  changeAccountDetails,
  changeUserAvatar,
  changeCoverImage,
  getCurrentUser,
  getChannel,
};
