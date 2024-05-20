import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import axiosInstance from "@/helper/axiosInstance";
import { IVideo } from "@/interfaces";

interface initialState {
  watchLaterVideos: { _id: string; watchLaterVideo: IVideo }[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalVideos: number;
  hasNextPage: boolean;
}

const initialState:initialState = {
  watchLaterVideos: [],
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalVideos: 0,
  hasNextPage: false,
};

const addVideoToWatchLater = createAsyncThunk(
  "/watch_later/add/videoId",
  async (videoId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/watch_later/${videoId}`);
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const removeVideoFromWatchLater = createAsyncThunk(
  "/watch_later/remove/videoId",
  async (videoId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/watch_later/${videoId}`);
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const getUserWatchLaterVideos = createAsyncThunk(
  "/watch_later/get",
  async (
    { queryParams }: { queryParams: { page?: number; limit?: number } },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get("/watch_later", {
        params: queryParams,
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

const watchLaterSlice = createSlice({
  name: "watch_later",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserWatchLaterVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.hasNextPage = false;
      })
      .addCase(getUserWatchLaterVideos.fulfilled, (state, action) => {
        const new_watchLaterVideos = action.payload.data?.result?.docs;
        state.watchLaterVideos =
          action.payload.data?.result?.page == 1
            ? new_watchLaterVideos
            : [...state.watchLaterVideos, ...new_watchLaterVideos];
        state.loading = false;
        state.error = null;
        state.currentPage = action.payload.data?.result?.page;
        state.totalVideos = action.payload.data?.result?.totalDocs || 0;
        state.totalPages = action.payload.data?.result?.totalPages;
        state.hasNextPage = action.payload.data?.result?.hasNextPage;
      })
      .addCase(getUserWatchLaterVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch watch later videos";
      });
  },
});

export default watchLaterSlice.reducer;
export const {} = watchLaterSlice.actions;
export {
  addVideoToWatchLater,
  removeVideoFromWatchLater,
  getUserWatchLaterVideos,
};
