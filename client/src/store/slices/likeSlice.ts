import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPaginationInfo, IVideo } from "@/interfaces";

interface initialState {
  likedVideos: { likedVideos: IVideo }[];
  likedVideosPaginationInfo: Partial<IPaginationInfo>;
}

const initialState: initialState = {
  likedVideos: [],
  likedVideosPaginationInfo: {},
};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    setLikedVideos: (
      state,
      action: PayloadAction<{ likedVideos: IVideo }[]>
    ) => {
      state.likedVideos = action.payload;
    },

    setLikedVideosPaginationInfo: (
      state,
      action: PayloadAction<initialState["likedVideosPaginationInfo"]>
    ) => {
      state.likedVideosPaginationInfo = action.payload;
    },
  },
});

export default likeSlice.reducer;
export const { setLikedVideos, setLikedVideosPaginationInfo } = likeSlice.actions;
