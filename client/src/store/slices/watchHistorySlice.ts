import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IVideo } from "@/interfaces";

interface initialState {
  watchHistories: {
    [key: string]: {
      date: string;
      videos: { video: IVideo; historyId: string }[];
    };
  };
  paginationInfo: {
    currentPage: number;
    totalPages: number;
    totalDocs: number;
    hasNextPage: boolean;
  };
}

const initialState: initialState = {
  watchHistories: {},
  paginationInfo: {
    currentPage: 0,
    totalPages: 0,
    totalDocs: 0,
    hasNextPage: false,
  },
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
    setPaginationInfo: (
      state,
      action: PayloadAction<initialState["paginationInfo"]>
    ) => {
      state.paginationInfo = action.payload;
    },
  },
});

export default watchHistorySlice.reducer;
export const { setWatchHistories, clearWatchHistories, setPaginationInfo } =
  watchHistorySlice.actions;
