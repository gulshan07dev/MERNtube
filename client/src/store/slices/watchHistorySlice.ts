import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPaginationInfo, IVideo } from "@/interfaces";

interface initialState {
  watchHistories: {
    [key: string]: {
      date: string;
      videos: { video: IVideo; historyId: string }[];
    };
  };
  watchHistoriesPaginationInfo: Partial<IPaginationInfo>;
}

const initialState: initialState = {
  watchHistories: {},
  watchHistoriesPaginationInfo: {},
};

const watchHistorySlice = createSlice({
  name: "watch_history",
  initialState,
  reducers: {
    setWatchHistories: (
      state,
      action: PayloadAction<initialState["watchHistories"]>
    ) => {
      state.watchHistories = { ...state.watchHistories, ...action.payload };
    },
    clearWatchHistories: (state) => {
      state.watchHistories = {};
    },
    setWatchHistoriesPaginationInfo: (
      state,
      action: PayloadAction<initialState["watchHistoriesPaginationInfo"]>
    ) => {
      state.watchHistoriesPaginationInfo = action.payload;
    },
  },
});

export default watchHistorySlice.reducer;
export const {
  setWatchHistories,
  clearWatchHistories,
  setWatchHistoriesPaginationInfo,
} = watchHistorySlice.actions;
