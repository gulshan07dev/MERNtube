import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPaginationInfo, IVideo } from "@/interfaces";

interface initialState {
  watchLaterVideos: { _id: string; watchLaterVideo: IVideo }[];
  watchLaterVideosPaginationInfo: Partial<IPaginationInfo>;
}

const initialState: initialState = {
  watchLaterVideos: [],
  watchLaterVideosPaginationInfo:  {},
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
    setWatchLaterVideosPaginationInfo: (
      state,
      action: PayloadAction<initialState["watchLaterVideosPaginationInfo"]>
    ) => {
      state.watchLaterVideosPaginationInfo = action.payload;
    },
  },
});

export default watchLaterSlice.reducer;
export const { setWatchLaterVideos, setWatchLaterVideosPaginationInfo } =
  watchLaterSlice.actions;
