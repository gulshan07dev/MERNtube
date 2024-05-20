import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/helper/axiosInstance";
import { IVideo } from "@/interfaces";

interface initialState {
  stats: {
    totalVideoViews?: number;
    totalSubscribers?: number;
    totalVideos?: number;
    totalVideoLikes?: number;
  };
  channelVideos: IVideo[];
}

const initialState: initialState = {
  stats: {},
  channelVideos: [],
};

const getChannelStats = createAsyncThunk(
  "/dashboards/stats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboards/stats");
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const getChannelVideos = createAsyncThunk(
  "/dashboards/videos",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboards/videos");
      return res?.data;
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  reducers: {},
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getChannelStats.fulfilled, (state, action) => {
        state.stats = action.payload?.data?.stats;
      })
      .addCase(getChannelStats.rejected, (state) => {
        state.stats = {};
      });

    builder.addCase(getChannelVideos.fulfilled, (state, action) => {
      state.channelVideos = action.payload?.data?.videos;
    });
    builder.addCase(getChannelVideos.rejected, (state) => {
      state.channelVideos = [];
    });
  },
});

export default dashboardSlice.reducer;
export { getChannelStats, getChannelVideos };
