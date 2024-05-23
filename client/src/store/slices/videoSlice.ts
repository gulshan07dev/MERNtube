import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPaginationInfo, IVideo } from "@/interfaces";

interface initialState {
  video: IVideo | null;
  videos: IVideo[];
  videosPaginationInfo: Partial<IPaginationInfo>;
}

const initialState: initialState = {
  video: null,
  videos: [],
  videosPaginationInfo: {},
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideo: (state, action: PayloadAction<IVideo>) => {
      state.video = action.payload;
    },
    setVideos: (state, action: PayloadAction<IVideo[]>) => {
      state.videos = action.payload;
    },
    setVideosPaginationInfo: (
      state,
      action: PayloadAction<IPaginationInfo>
    ) => {
      state.videosPaginationInfo = action.payload;
    },
  },
});

export default videoSlice.reducer;
export const { setVideo, setVideos, setVideosPaginationInfo } =
  videoSlice.actions;
