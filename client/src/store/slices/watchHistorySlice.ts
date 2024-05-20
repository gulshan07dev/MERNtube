import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/helper/axiosInstance";
import { IWatchHistoryVideo } from "@/interfaces";

interface initialState {
  watchHistories: IWatchHistoryVideo[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalVideos: number;
  hasNextPage: boolean;
}

const initialState: initialState = {
  watchHistories: [],
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalVideos: 0,
  hasNextPage: false,
};

const addVideoToWatchHistory = createAsyncThunk(
  "/watch_history/add/videoId",
  async (videoId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/watch_history/add/${videoId}`);
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const removeVideoToWatchHistory = createAsyncThunk(
  "/watch_history/remove/historyId",
  async (historyId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(
        `/watch_history/remove/${historyId}`
      );
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const clearWatchHistory = createAsyncThunk(
  "/watch_history/clear",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete("/watch_history");
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const toggleWatchHistoryPauseStatus = createAsyncThunk(
  "/watch_history/toggle_status",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch("/watch_history/toggle_status");
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const getWatchHistory = createAsyncThunk(
  "/watch_history/get",
  async (
    { queryParams }: { queryParams: { page?: number; limit?: number } },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get("/watch_history", {
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

const watchHistorySlice = createSlice({
  name: "watch_history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWatchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.hasNextPage = false;
      })
      .addCase(getWatchHistory.fulfilled, (state, action) => {
        const new_watchHistory = action.payload.data?.result?.docs;
        state.watchHistories =
          action.payload.data?.result?.page == 1
            ? new_watchHistory
            : [...state.watchHistories, ...new_watchHistory];
        state.loading = false;
        state.error = null;
        state.currentPage = action.payload.data?.result?.page;
        state.totalVideos = action.payload.data?.result?.totalDocs || 0;
        state.totalPages = action.payload.data?.result?.totalPages;
        state.hasNextPage = action.payload.data?.result?.hasNextPage;
      })
      .addCase(getWatchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch watch history";
      })

      .addCase(clearWatchHistory.fulfilled, (state) => {
        state.watchHistories = [];
        state.totalVideos = 0;
        state.totalPages = 1;
      });
  },
});

export default watchHistorySlice.reducer;
export const {} = watchHistorySlice.actions;
export {
  addVideoToWatchHistory,
  removeVideoToWatchHistory,
  clearWatchHistory,
  toggleWatchHistoryPauseStatus,
  getWatchHistory,
};
