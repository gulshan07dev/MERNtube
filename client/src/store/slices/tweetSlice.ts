import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import { User } from "./authSlice";

export interface Tweet {
  _id: string;
  content: string;
  owner: User;
  createdAt: Date;
}

interface initialState {
  tweets: Tweet[];
}

const initialState: initialState = {
  tweets: [],
};

const createTweet = createAsyncThunk(
  "/tweets/add-tweet",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/tweets", data);
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const updateTweet = createAsyncThunk(
  "/tweets/update-tweet/tweetId",
  async (
    { data, tweetId }: { data: { content: string }; tweetId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.patch(`/tweets/${tweetId}`, data);
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const deleteTweet = createAsyncThunk(
  "/tweets/delete-tweet/tweetId",
  async (tweetId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/tweets/${tweetId}`);
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const getUserTweets = createAsyncThunk(
  "/tweets/userId",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/tweets/${userId}`);
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserTweets.pending, (state) => {
        state.tweets = [];
      })
      .addCase(getUserTweets.fulfilled, (state, action) => {
        state.tweets = action.payload?.data?.tweets;
      })
      .addCase(getUserTweets.rejected, (state) => {
        state.tweets = [];
      });
  },
});

export default tweetSlice.reducer;
export const {} = tweetSlice.actions;
export { createTweet, updateTweet, deleteTweet, getUserTweets };
