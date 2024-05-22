import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IVideo } from "@/interfaces";

interface initialState {
  watchLaterVideos: { _id: string; watchLaterVideo: IVideo }[];
  paginationInfo: {
    currentPage: number;
    totalPages: number;
    totalDocs: number;
    hasNextPage: boolean;
  };
}

const initialState: initialState = {
  watchLaterVideos: [],
  paginationInfo: {
    currentPage: 0,
    totalPages: 0,
    totalDocs: 0,
    hasNextPage: false,
  },
};

const watchLaterSlice = createSlice({
  name: "watch_later",
  initialState,
  reducers: {
    setWatchLaterVideos: (
      state,
      action: PayloadAction<initialState["watchLaterVideos"]>
    ) => {
      state.watchLaterVideos = action.payload;
    },
    setPaginationInfo: (
      state,
      action: PayloadAction<initialState["paginationInfo"]>
    ) => {
      state.paginationInfo = action.payload;
    },
  },
});

export default watchLaterSlice.reducer;
export const { setWatchLaterVideos, setPaginationInfo } = watchLaterSlice.actions;
