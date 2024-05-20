import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PaginationInfo } from "@/component/ScrollPagination";
import { IVideo } from "@/interfaces";

interface initialState {
  video: IVideo | null;
  videos: IVideo[];
  paginationInfo: PaginationInfo;
}

const initialState: initialState = {
  video: null,
  videos: [],
  paginationInfo: {
    currentPage: 0,
    totalPages: 1,
    totalDocs: 1,
    hasNextPage: true,
  },
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
    setPaginationInfo: (state, action: PayloadAction<PaginationInfo>) => {
      state.paginationInfo = action.payload;
    },
  },
});

export default videoSlice.reducer;
export const { setVideo, setVideos, setPaginationInfo } = videoSlice.actions;
