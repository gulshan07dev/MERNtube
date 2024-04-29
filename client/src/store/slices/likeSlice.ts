import axiosInstance from "@/helper/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Video } from "./videoSlice";

interface initialState {
  likedVideos: { likedVideos: Video }[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalVideos: number;
  hasNextPage: boolean;
}

const initialState: initialState = {
  likedVideos: [],
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalVideos: 0,
  hasNextPage: false,
};

const toggleVideoLike = createAsyncThunk(
  "/likes/video/videoId",
  async (videoId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/likes/video/${videoId}`);
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const toggleCommentLike = createAsyncThunk(
  "/likes/comment/commentId",
  async (commentId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/likes/comment/${commentId}`);
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const toggleTweetLike = createAsyncThunk(
  "/likes/tweet/tweetId",
  async (tweetId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/likes/tweet/${tweetId}`);
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const getLikedVideos = createAsyncThunk(
  "/likes/videos",
  async (
    { queryParams }: { queryParams: { page?: number; limit?: number } },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get("/likes/videos", {
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

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLikedVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.hasNextPage = false;
      })
      .addCase(getLikedVideos.fulfilled, (state, action) => {
        const new_likedVideos = action.payload.data?.result?.docs;
        state.likedVideos =
          action.payload.data?.result?.page == 1
            ? new_likedVideos
            : [...state.likedVideos, ...new_likedVideos];
        state.loading = false;
        state.error = null;
        state.currentPage = action.payload.data?.result?.page;
        state.totalVideos = action.payload.data?.result?.totalDocs || 0;
        state.totalPages = action.payload.data?.result?.totalPages;
        state.hasNextPage = action.payload.data?.result?.hasNextPage;
      })
      .addCase(getLikedVideos.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch watch later videos";
      });
  },
});

export default likeSlice.reducer;
export const {} = likeSlice.actions;
export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
