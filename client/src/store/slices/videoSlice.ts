import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "./authSlice";

export interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoFile: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner?: User;
  videoLikesCount?: number;
  isLiked?: boolean;
  createdAt: Date;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalDocs: number;
  hasNextPage: boolean;
}

interface initialState {
  video: Video | null;
  videos: Video[];
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
    setVideo: (state, action: PayloadAction<Video>) => {
      state.video = action.payload;
    },
    setVideos: (state, action: PayloadAction<Video[]>) => {
      state.videos = action.payload;
    },
    setPaginationInfo: (state, action: PayloadAction<PaginationInfo>) => {
      state.paginationInfo = action.payload;
    },
  },
});

export default videoSlice.reducer;
export const { setVideo, setVideos, setPaginationInfo } = videoSlice.actions;
