import { PayloadAction, createSlice } from "@reduxjs/toolkit";
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

const dashboardSlice = createSlice({
  name: "dashboard",
  reducers: {
    setStats: (state, action: PayloadAction<initialState["stats"]>) => {
      state.stats = action.payload;
    },
    setChannelVideos: (
      state,
      action: PayloadAction<initialState["channelVideos"]>
    ) => {
      state.channelVideos = action.payload;
    },
  },
  initialState,
});

export default dashboardSlice.reducer;
export const { setStats, setChannelVideos } = dashboardSlice.actions;
