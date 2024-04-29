import axiosInstance from "@/helper/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "./authSlice";

interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortType?: "acc" | "desc"
}

export interface Comment {
  _id: string;
  content: string;
  owner: User;
  isLiked: boolean;
  commentLikesCount: number;
  createdAt: Date;
}

export interface VideoComment extends Comment {
  video: string;
}

export interface TweetComment extends Comment {
  tweet: string;
}

interface initialState {
  videoComment: VideoComment | null;
  tweetComment: TweetComment | null;
}

const initialState: initialState = {
  videoComment: null,
  tweetComment: null,
};

const addCommentToVideo = createAsyncThunk(
  "/add-comment/video/videoId",
  async (
    { data, videoId }: { data: { content: string }; videoId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post(`/comments/video/${videoId}`, data);
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const addCommentToTweet = createAsyncThunk(
  "/add-comment/tweet/tweetId",
  async (
    { data, tweetId }: { data: { content: string }; tweetId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post(`/comments/tweet/${tweetId}`, data);
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const updateComment = createAsyncThunk(
  "/update-comment/commentId",
  async (
    { data, commentId }: { data: { content: string }; commentId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.patch(`/comments/${commentId}`, data);
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const deleteComment = createAsyncThunk(
  "/delete-comment/commentId",
  async (commentId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/comments/${commentId}`);
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const getVideoComment = createAsyncThunk(
  "/get-comment/video/videoId",
  async (
    { videoId, queryParams }: { videoId: string; queryParams: QueryParams },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get(`/comments/video/${videoId}`, {
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

const getTweetComment = createAsyncThunk(
  "/get-comment/tweet/tweetId",
  async (
    { tweetId, queryParams }: { tweetId: string; queryParams: QueryParams },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get(`/comments/tweet/${tweetId}`, {
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

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (_builder) => {},
});

export default commentSlice.reducer;
export const {} = commentSlice.actions;
export {
  addCommentToVideo,
  addCommentToTweet,
  updateComment,
  deleteComment,
  getVideoComment,
  getTweetComment,
};
