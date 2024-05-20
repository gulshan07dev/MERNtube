import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IVideo } from "@/interfaces";

interface initialState {
  likedVideos: { likedVideos: IVideo }[];
}

const initialState: initialState = {
  likedVideos: [],
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
  },
});

export default likeSlice.reducer;
export const { setLikedVideos } = likeSlice.actions;
