import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import { User } from "./authSlice";

interface QueryParams {
  page?: number;
  limit?: number;
}

export interface Tweet {
  _id: string;
  content: string;
  owner: User;
  tweetLikesCount: number;
  isLiked: boolean;
  createdAt: Date;
}

interface initialState {
  tweet: Tweet | null;
  tweets: Tweet[];
}

const initialState: initialState = {
  tweet: null,
  tweets: [],
};

const createTweet = createAsyncThunk(
  "/tweets/add-tweet",
  async (data: { content: string }, { rejectWithValue }) => {
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
  async (tweetId: string, { rejectWithValue }) => {
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

const getTweetById = createAsyncThunk(
  "/tweets/tweetId",
  async (tweetId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/tweets/${tweetId}`);
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
  "/tweets/user/userId",
  async (
    { userId, queryParams }: { userId: string; queryParams: QueryParams },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get(`/tweets/user/${userId}`, {
        params: queryParams,
      });
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
  reducers: {
    setTweets: (state, action) => {
      state.tweets = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTweet.fulfilled, (state, action) => {
        state.tweet = action.payload?.data?.tweet;
      })

      .addCase(getTweetById.pending, (state) => {
        state.tweet = null;
      })
      .addCase(getTweetById.fulfilled, (state, action) => {
        state.tweet = action.payload?.data?.tweet;
      })
      .addCase(getTweetById.rejected, (state) => {
        state.tweet = null;
      })

      .addCase(getUserTweets.fulfilled, (state, action) => {
        const newTweets = action.payload?.data?.result?.docs;
        state.tweets =
          action.payload?.data?.result?.page === 1
            ? newTweets
            : [...state.tweets, ...newTweets];
      })
      .addCase(getUserTweets.rejected, (state) => {
        state.tweets = [];
      });
  },
});

export default tweetSlice.reducer;
export const {setTweets} = tweetSlice.actions;
export { createTweet, updateTweet, deleteTweet, getTweetById, getUserTweets };
