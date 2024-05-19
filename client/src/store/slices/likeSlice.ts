import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Video } from "./videoSlice";
import { PaginationInfo } from "@/component/ScrollPagination";

interface initialState {
  likedVideos: { likedVideos: Video }[];
  paginationInfo: PaginationInfo;
}

const initialState: initialState = {
  likedVideos: [],
  paginationInfo: {
    currentPage: 0,
    totalPages: 1,
    totalDocs: 1,
    hasNextPage: true,
  },
};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    setLikedVideos: (
      state,
      action: PayloadAction<{ likedVideos: Video }[]>
    ) => {
      state.likedVideos = action.payload;
    },
    setPaginationInfo: (state, action: PayloadAction<PaginationInfo>) => {
      state.paginationInfo = action.payload;
    },
  },
});

export default likeSlice.reducer;
export const { setLikedVideos, setPaginationInfo } = likeSlice.actions;
